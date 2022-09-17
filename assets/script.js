turtley.onReady = async () => {
  const turtle = new turtley.Turtle();
  turtle.init({
    appendTo: document.getElementById("demoCanvasWrapper")
  });
  
  await turtle.setBackgroundColor("antiquewhite");
  await turtle.moveTo(-5, -5);
  await turtle.penDown();
  await turtle.setPenColor("blue");

  let i = 1;
  while (true) {
    i++;
    await turtle.forward(10*i);
    await turtle.rotateRight(90);
    if (turtle.canvasHeight - turtle.y*2 <= 50)
      break;
  }
};

const code = `turtley.onReady = ${turtley.onReady.toString()};`;

const codeElem = document.getElementById("demoCode");
codeElem.innerHTML = sanitizeHtml(code);

hljs.highlightAll();

function sanitizeHtml(html) {
  return html
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}