const docsNav = document.querySelector(".docsNav");
const docsNavList = document.querySelector(".docsNavList");
const docsContent = document.querySelector(".docsContent");

fetch("./assets/docsData.json")
  .then(res => res.json())
  .then(docsData => {
    document.querySelector(".installCode").innerHTML =
      sanitizeHtml(`<script src="https://turtleyjs.techpandapro.repl.co/lib/v1.0.0/index.js" defer></script>`);

    document.querySelector(".initExample").innerHTML =
      sanitizeHtml(
        [
          'turtley.onReady = async () => {',
          '  const turtle = new turtley.Turtle();',
          '  turtle.init();',
          '};'
        ].join("\n")
      );
    
    document.querySelector(".asyncAwait1").innerHTML = sanitizeHtml(
      [
        'console.log(turtle.x + ", " + turtle.y); // logs "0, 0"',
        'turtle.forward(100); // moves the turtle forward',
        'console.log(turtle.x + ", " + turtle.y); // still logs "0, 0"'
      ].join("\n")
    );

    document.querySelector(".asyncAwait2").innerHTML = sanitizeHtml(
      [
        'console.log(turtle.x + ", " + turtle.y); // logs "0, 0"',
        'await turtle.forward(100); // moves the turtle forward',
        'console.log(turtle.x + ", " + turtle.y); // logs "100, 0"'
      ].join("\n")
    );
    
    for (const turtleClass of docsData) {
      const classLi = document.createElement("li");
      classLi.innerText = turtleClass.navClass;
      docsNavList.append(classLi);
      
      const classNavList = document.createElement("ul");
      classNavList.classList.add("classNavList");
      docsNavList.append(classNavList);

      let lastHeader = null;
      
      for (const turtleClassMethod of turtleClass.methods) {
        const thisHeader = turtleClassMethod.header ?? turtleClass.header;
        
        if (thisHeader !== lastHeader) {
          const header = document.createElement("h2");
          header.innerText = thisHeader;
          docsContent.append(header);
          lastHeader = thisHeader;
        }
        
        const params = turtleClassMethod.params;

        const id = `${turtleClass.class}.${turtleClassMethod.name}`;
        
        const methodContainer = document.createElement("div");
        methodContainer.classList.add("methodContainer");
        methodContainer.id = id;
        
        const docsMethod = document.createElement("h3");
        docsMethod.classList.add("docsMethod");

        const classSpan = document.createElement("span");
        classSpan.classList.add("docsClassSpan");
        classSpan.innerText = turtleClass.class;

        const methodSpan = document.createElement("span");
        methodSpan.classList.add("docsMethodSpan");
        methodSpan.innerText = `.${turtleClassMethod.name}(`;
        
        const paramsSpan = document.createElement("span");
        paramsSpan.classList.add("docsParamsSpan");

        const mappedParams = params.map(p => p.name.split(".")[0]);
        
        paramsSpan.innerText = mappedParams
          .filter((p, i) => mappedParams.indexOf(p) === i)
          .join(", ");

        const closingParen = document.createElement("span");
        closingParen.classList.add("docsMethodSpan");
        closingParen.innerText = ")";

        docsMethod.append(classSpan, methodSpan, paramsSpan, closingParen);
        
        let paramTableContainer;
        if (params.length >= 1) {
          paramTableContainer = document.createElement("div");
          paramTableContainer.classList.add("paramTableContainer");
          
          paramTable = document.createElement("table");
          paramTable.classList.add("paramTable");

          const tableNameRow = document.createElement("tr");
          
          const tableName = document.createElement("th");
          tableName.setAttribute("colspan", Object.keys(params[0]).length);
          tableName.innerText = "Parameters";
          tableNameRow.append(tableName);

          paramTable.append(tableNameRow);

          const paramInfoTr = document.createElement("tr");

          for (const paramInfo in params[0]) {
            const tableHeader = document.createElement("th");
            tableHeader.innerText = paramInfo.substring(0, 1).toUpperCase() + paramInfo.substring(1);
            paramInfoTr.append(tableHeader);
          }

          paramTable.append(paramInfoTr);

          for (const param of params) {
            const paramTr = document.createElement("tr");

            for (const paramInfo in param) {
              const paramTd = document.createElement("td");
              paramTd.innerHTML = param[paramInfo];
              paramTr.append(paramTd);
            }

            paramTable.append(paramTr);
          }

          paramTableContainer.append(paramTable);
        }

        const description = document.createElement("p");
        description.innerText = turtleClassMethod.description;
        
        methodContainer.append(docsMethod, description);
        if (paramTableContainer) docsMethod.after(paramTableContainer);

        docsContent.append(methodContainer);

        const docsLinkLi = document.createElement("li");

        const docsLink = document.createElement("a");
        docsLink.innerText = `.${turtleClassMethod.name}()`;
        docsLink.href = `#${id}`;

        docsLinkLi.append(docsLink);
        
        classNavList.append(docsLinkLi);
      }

      for (const turtleClassProperty of turtleClass.properties) {
        const thisHeader = turtleClassProperty.header ?? turtleClass.header;
        
        if (thisHeader !== lastHeader) {
          const header = document.createElement("h2");
          header.innerText = thisHeader;
          docsContent.append(header);
          lastHeader = thisHeader;
        }

        const id = `${turtleClass.class}.${turtleClassProperty.name}`;
        
        const methodContainer = document.createElement("div");
        methodContainer.classList.add("methodContainer");
        methodContainer.id = id;
        
        const docsProperty = document.createElement("h3");
        docsProperty.classList.add("docsProperty");

        const classSpan = document.createElement("span");
        classSpan.classList.add("docsClassSpan");
        classSpan.innerText = turtleClass.class;

        const propertySpan = document.createElement("span");
        propertySpan.classList.add("docsPropertySpan");
        propertySpan.innerText = `.${turtleClassProperty.name}`;

        docsProperty.append(classSpan, propertySpan);

        const description = document.createElement("p");
        description.innerText = turtleClassProperty.description;
        
        methodContainer.append(docsProperty, description);

        docsContent.append(methodContainer);

        const docsLinkLi = document.createElement("li");

        const docsLink = document.createElement("a");
        docsLink.innerText = `.${turtleClassProperty.name}`;
        docsLink.href = `#${id}`;

        docsLinkLi.append(docsLink);
        
        classNavList.append(docsLinkLi);
      }
    }

    hljs.highlightAll();

    const hash = window.location.hash;

    if (hash)
      document.getElementById(hash.substring(1))?.scrollIntoView();
  });

function sanitizeHtml(html) {
  return html
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}