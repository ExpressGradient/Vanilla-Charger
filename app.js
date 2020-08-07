// PowerJS starts here..
const hook = (element) => {
    const domElement = document.querySelector(element);
    domElement.innerHTML = eval('`' + domElement.innerHTML + '`');
    return domElement;
}

const statefulHook = (element, store) => {
    const domElement = document.querySelector(element);
    
    domElement.rawDOM = domElement.innerHTML;
    store.subscribers.push(domElement);

    domElement.innerHTML = eval('`' + domElement.innerHTML + '`');
    return domElement;
}

const updateHook = (hook, updateDOM) => hook.innerHTML = eval('`' + updateDOM + '`');

const inject = (from, to) => {
    to.innerHTML += from.innerHTML;
}

const store = (data) => {
    let state = {
        data,
        subscribers: []
    };

    let proxyState = new Proxy(state, {
        get: (target, prop) => target[prop],
        set: (target, prop, value) => {
            if(prop === "data") {
                target[prop] = value;
                target["subscribers"].forEach(subscriber => updateHook(subscriber, subscriber.rawDOM));

                // Uncomment the below for debugging
                // console.log("State: ", target[prop]);
            } else if(prop === "subscribers") {
                target[prop] = value;
            }
        }
    });

    return proxyState;
}

const conditionalHook = (element, condition, trueDOM, falseDOM) => {
    const domElement = document.querySelector(element);

    domElement.rawDOM = domElement.innerHTML;
    domElement.trueDOM = trueDOM;
    domElement.falseDOM = falseDOM;

    condition.subscribers.push(domElement);

    domElement.innerHTML = condition.condition ? eval('`' + domElement.innerHTML + '`') : "";
    return domElement;
}

const conditionalStore = (condition) => {
    let state = {
        condition,
        subscribers: []
    };

    let proxyState = new Proxy(state, {
        get: (target, prop) => target[prop],
        set: (target, prop, value) => {
            target[prop] = value;

            if(prop === "condition") {
                // Uncomment the below line for debugging
                // console.log("Condition: ", target[prop]);

                target["subscribers"].forEach(subscriber => {
                    if(target["condition"]) {
                        updateHook(subscriber, subscriber.trueDOM);
                    } else {
                        updateHook(subscriber, subscriber.falseDOM);
                    }
                })
            }
        }
    });

    return proxyState;
}
// PowerJS ends here..


// Start building your app from here..
const firstname = "Express";
const lastname = "Gradient";

const heading = hook("h1");
const paragraph = hook("p");

const component = hook(".component");
const renderDiv = hook("#render-div");

inject(component, renderDiv);

let count = store(0);

const counter = statefulHook("#counter", count);

const button = hook(".increment-button");

button.addEventListener("click", () => {
    count["data"]++;
})

let name = store("")

let textDisplay = statefulHook("#textDisplay", name);
let input = hook("input");
input.value = name["data"]

input.addEventListener("input", (event) => {
    name["data"] = event.target.value;
});

let condition = conditionalStore(false);

let tempHook = hook(".conditional-block");

let conditionalBlock = conditionalHook(".conditional-block", condition, tempHook.innerHTML, "");

let conditionalButton = hook(".conditional-button");

conditionalButton.addEventListener("click", () => condition.condition = !condition.condition);