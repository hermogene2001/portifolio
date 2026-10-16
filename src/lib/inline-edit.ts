// On-page inline editor for the public site, driven by jQuery.
//
// When an admin is signed in (localStorage holds the admin token) every element
// carrying a `data-inline-*` attribute becomes click-to-edit. Saving posts to
// /api/inline-update with a plain `$.ajax` call, so the page updates in place
// without a reload or a trip through the /admin dashboard.
//
// This module is loaded lazily from the home route's useEffect, so it never
// runs during SSR and never pulls jQuery into the server bundle.
import $ from "jquery"

import { INLINE_LONG_FIELDS } from "@/lib/inline"
import { inlineUpdate } from "@/server/api"

const TOKEN_KEY = "portfolio_admin_token"
const SKIN_KEY = "portfolio_skin"
const DEFAULT_ACCENT = "#f021b2"

type InlineTarget = {
  el: HTMLElement
  target: string
  field: string
  id?: number
  long: boolean
}

function readToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY)
  } catch {
    return null
  }
}

function accentColor(): string {
  try {
    return localStorage.getItem(SKIN_KEY) || DEFAULT_ACCENT
  } catch {
    return DEFAULT_ACCENT
  }
}

function injectStyles() {
  if (document.getElementById("inline-edit-styles")) return
  const style = document.createElement("style")
  style.id = "inline-edit-styles"
  style.textContent = `
.inline-edit-on [data-inline] {
  cursor: pointer;
  border-radius: 6px;
  transition: background-color .15s ease, box-shadow .15s ease;
}
.inline-edit-on [data-inline]:hover {
  background: rgba(240, 33, 178, .10);
  box-shadow: 0 0 0 2px var(--inline-accent, ${DEFAULT_ACCENT});
}
.inline-edit-on [data-inline].inline-edit-active {
  background: #fff;
  box-shadow: 0 0 0 2px var(--inline-accent, ${DEFAULT_ACCENT});
  outline: none;
  cursor: text;
}
.inline-edit-on [data-inline].inline-edit-active:focus { outline: none; }
.inline-edit-on [data-inline][contenteditable] { white-space: pre-wrap; }
.inline-edit-on [data-inline].inline-edit-dirty { box-shadow: 0 0 0 2px #f59e0b; }
.inline-edit-on [data-inline].inline-edit-saved {
  animation: inlineEditSaved .9s ease;
  box-shadow: 0 0 0 2px #10b981;
}
@keyframes inlineEditSaved {
  0% { background: rgba(16, 185, 129, .28); }
  100% { background: transparent; }
}
#inline-edit-banner, #inline-edit-toolbar {
  font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
}
#inline-edit-banner {
  position: fixed;
  left: 16px;
  bottom: 16px;
  z-index: 2147483000;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  border-radius: 999px;
  background: rgba(17, 24, 39, .94);
  color: #f9fafb;
  font-size: 12.5px;
  line-height: 1;
  box-shadow: 0 10px 30px rgba(0, 0, 0, .3);
}
#inline-edit-banner .ie-dot {
  width: 8px; height: 8px; border-radius: 999px;
  background: var(--inline-accent, ${DEFAULT_ACCENT});
  box-shadow: 0 0 0 4px rgba(240, 33, 178, .22);
}
#inline-edit-banner a, #inline-edit-banner button {
  color: inherit; background: none; border: 0; cursor: pointer;
  font: inherit; text-decoration: underline; text-underline-offset: 2px; padding: 0;
}
#inline-edit-banner .ie-sep { opacity: .4; }
#inline-edit-toolbar {
  position: fixed;
  z-index: 2147483001;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px;
  border-radius: 10px;
  background: rgba(17, 24, 39, .96);
  color: #f9fafb;
  font-size: 12.5px;
  box-shadow: 0 12px 34px rgba(0, 0, 0, .35);
}
#inline-edit-toolbar button {
  border: 0; border-radius: 7px; cursor: pointer;
  padding: 6px 10px; font: inherit; line-height: 1;
  background: rgba(255, 255, 255, .12); color: #f9fafb;
}
#inline-edit-toolbar button.ie-save {
  background: var(--inline-accent, ${DEFAULT_ACCENT}); color: #fff; font-weight: 600;
}
#inline-edit-toolbar button:disabled { opacity: .5; cursor: default; }
#inline-edit-toolbar .ie-hint { opacity: .7; padding: 0 4px; }
#inline-edit-toast {
  position: fixed;
  left: 50%;
  bottom: 24px;
  transform: translateX(-50%);
  z-index: 2147483002;
  padding: 10px 16px;
  border-radius: 10px;
  font-family: ui-sans-serif, system-ui, sans-serif;
  font-size: 13px;
  color: #fff;
  box-shadow: 0 12px 34px rgba(0, 0, 0, .35);
}
#inline-edit-toast.ie-error { background: #dc2626; }
#inline-edit-toast.ie-ok { background: #059669; }
`
  document.head.appendChild(style)
}

function showToast(message: string, kind: "ok" | "error") {
  document.getElementById("inline-edit-toast")?.remove()
  const toast = document.createElement("div")
  toast.id = "inline-edit-toast"
  toast.className = kind === "error" ? "ie-error" : "ie-ok"
  toast.textContent = message
  document.body.appendChild(toast)
  window.setTimeout(() => toast.remove(), 2600)
}

/** Update every element bound to the same field (e.g. summary in hero + about). */
function syncField(
  target: string,
  field: string,
  id: number | undefined,
  value: string
) {
  let selector = `[data-inline-target="${target}"][data-inline-field="${field}"]`
  if (id !== undefined) selector += `[data-inline-id="${id}"]`
  $(selector).each(function () {
    const $node = $(this)
    $node.text(value)
    $node.addClass("inline-edit-saved")
    window.setTimeout(() => $node.removeClass("inline-edit-saved"), 950)
  })
}

export function startInlineEdit(): () => void {
  const token = readToken()
  if (!token) return () => {}

  injectStyles()
  document.documentElement.style.setProperty("--inline-accent", accentColor())
  document.body.classList.add("inline-edit-on")

  let editing: InlineTarget | null = null
  let originalHtml = ""
  let toolbar: HTMLElement | null = null
  let scrollHandler: (() => void) | null = null

  const closeEditor = (restore: boolean) => {
    if (!editing) return
    const { el } = editing
    el.removeAttribute("contenteditable")
    el.classList.remove("inline-edit-active", "inline-edit-dirty")
    if (restore) el.innerHTML = originalHtml
    if (scrollHandler) {
      window.removeEventListener("scroll", scrollHandler)
      scrollHandler = null
    }
    toolbar?.remove()
    toolbar = null
    editing = null
    originalHtml = ""
  }

  const placeToolbar = (el: HTMLElement) => {
    if (!toolbar) return
    const rect = el.getBoundingClientRect()
    toolbar.style.top = `${Math.max(8, rect.top - 44)}px`
    toolbar.style.left = `${Math.min(
      Math.max(8, rect.left),
      Math.max(8, window.innerWidth - (toolbar.offsetWidth || 220) - 8)
    )}px`
  }

  const readValue = (el: HTMLElement) =>
    (el.innerText || el.textContent || "").trim()

  const save = () => {
    if (!editing) return
    const { el, target, field, id } = editing
    const value = readValue(el)
    const saveButton = toolbar?.querySelector<HTMLButtonElement>(".ie-save")
    if (saveButton) saveButton.disabled = true

    $.ajax({
      url: inlineUpdate.url,
      type: "POST",
      headers: { "x-tsr-serverFn": "true" },
      dataType: "json",
      data: { token, target, field, id, value },
    })
      .done(() => {
        closeEditor(false)
        syncField(target, field, id, value)
        showToast("Saved", "ok")
      })
      .fail((xhr: JQuery.jqXHR) => {
        if (saveButton) saveButton.disabled = false
        const message =
          (xhr.responseJSON as { error?: string } | undefined)?.error ??
          (xhr.status === 401
            ? "Session expired — sign in at /admin again."
            : "Could not save. Try again.")
        showToast(message, "error")
      })
  }

  const openEditor = (el: HTMLElement) => {
    if (editing) closeEditor(true)

    const target = el.getAttribute("data-inline-target") ?? ""
    const field = el.getAttribute("data-inline-field") ?? ""
    const idAttr = el.getAttribute("data-inline-id")
    const id = idAttr ? Number(idAttr) : undefined
    const long =
      el.getAttribute("data-inline-long") === "true" ||
      INLINE_LONG_FIELDS.has(field)

    editing = { el, target, field, id, long }
    originalHtml = el.innerHTML

    el.setAttribute("contenteditable", "plaintext-only")
    el.classList.add("inline-edit-active")

    toolbar = document.createElement("div")
    toolbar.id = "inline-edit-toolbar"
    toolbar.innerHTML = `
      <button type="button" class="ie-save">Save</button>
      <button type="button" class="ie-cancel">Cancel</button>
      <span class="ie-hint"></span>
    `
    toolbar.querySelector(".ie-hint")!.textContent = long
      ? "Ctrl+Enter saves · Esc cancels"
      : "Enter saves · Esc cancels"

    toolbar.querySelector(".ie-save")?.addEventListener("click", save)
    toolbar.querySelector(".ie-cancel")?.addEventListener("click", () => {
      closeEditor(true)
    })

    document.body.appendChild(toolbar)
    placeToolbar(el)

    el.addEventListener("input", () => {
      el.classList.add("inline-edit-dirty")
    })

    scrollHandler = () => placeToolbar(el)
    window.addEventListener("scroll", scrollHandler, { passive: true })

    // Focus and select the current text so typing replaces it.
    el.focus()
    const selection = window.getSelection()
    if (selection) {
      const range = document.createRange()
      range.selectNodeContents(el)
      selection.removeAllRanges()
      selection.addRange(range)
    }
  }

  $(document)
    .off("click.inlineEdit", "[data-inline]")
    .on(
      "click.inlineEdit",
      "[data-inline]",
      function (this: HTMLElement, event) {
        event.preventDefault()
        event.stopPropagation()
        if (editing?.el === this) return
        openEditor(this)
      }
    )
    .off("mousedown.inlineEditOutside")
    .on("mousedown.inlineEditOutside", (event) => {
      if (!editing) return
      const target = event.target as Node
      if (editing.el.contains(target)) return
      if (toolbar && toolbar.contains(target)) return
      closeEditor(true)
    })
    .off("keydown.inlineEdit")
    .on("keydown.inlineEdit", (event) => {
      if (!editing) return
      if (event.key === "Escape") {
        event.preventDefault()
        closeEditor(true)
      } else if (
        event.key === "Enter" &&
        (!editing.long || event.ctrlKey || event.metaKey)
      ) {
        event.preventDefault()
        save()
      }
    })

  const banner = document.createElement("div")
  banner.id = "inline-edit-banner"
  banner.innerHTML = `
    <span class="ie-dot"></span>
    <span>Inline edit on — click any text to change it</span>
    <span class="ie-sep">|</span>
    <a href="/admin">Admin</a>
    <span class="ie-sep">|</span>
    <button type="button" class="ie-exit">Hide</button>
  `
  banner.querySelector(".ie-exit")?.addEventListener("click", () => stop())
  document.body.appendChild(banner)

  function stop() {
    closeEditor(true)
    $(document).off("click.inlineEdit", "[data-inline]")
    $(document).off("mousedown.inlineEditOutside")
    $(document).off("keydown.inlineEdit")
    document.body.classList.remove("inline-edit-on")
    document.documentElement.style.removeProperty("--inline-accent")
    banner.remove()
    document.getElementById("inline-edit-toast")?.remove()
  }

  return stop
}
