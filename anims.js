function toggleCollapsible(event = null, state = null) {
	this.classList.toggle("active");
	let content = this.nextElementSibling;
	if (content.style.maxHeight) {
		content.style.maxHeight = null;
	} else {
		content.style.maxHeight = content.scrollHeight + "px";
	}
}

document.querySelectorAll(".collapsible").forEach(col => {
	// toggleCollapsible.call(col, null, false);
	col.classList.toggle("active");
	let content = col.nextElementSibling;
	content.style.maxHeight = content.scrollHeight + "px";
	col.addEventListener("click", toggleCollapsible);
});