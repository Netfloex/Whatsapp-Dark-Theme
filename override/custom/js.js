const d = document.querySelector.bind(document)
var elements = {
    messagesBackground: ".MVjBr",
}
addEventListener("dblclick", e => {
    e.preventDefault()
    var c = e.target.querySelector(elements.messagesBackground)
    if (c) {
        c = c.classList
        c.add("messageDblClick")
        c.add("messageDblClickAnimation")
        setTimeout(() => {
            c.remove("messageDblClickAnimation")
        }, 1000)
    }
})
addEventListener("keyup", e => {
    if (e.ctrlKey) {
        if (e.key == "t") {
            var s = document.querySelectorAll(".injected-stylesheet")
            s = Array.from(s)
            s.map(s => s.disabled = !s.disabled)
        }
    }
})