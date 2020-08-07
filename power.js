// PowerJS starts here..
import { data } from "./main.js";

export const hook = (element) => {
    const domElement = document.querySelector(element);
    domElement.innerHTML = eval('`' + domElement.innerHTML + '`');
    return domElement;
}

export const statefulHook = (element, store) => {
    const domElement = document.querySelector(element);

    domElement.rawDOM = domElement.innerHTML;
    store.subscribers.push(domElement);

    domElement.innerHTML = eval('`' + domElement.innerHTML + '`');
    return domElement;
}

const updateHook = (hook, updateDOM) => hook.innerHTML = eval('`' + updateDOM + '`');

export const inject = (from, to) => {
    to.innerHTML += from.innerHTML;
}

export const store = (value) => {
    let state = {
        value,
        subscribers: []
    };

    let proxyState = new Proxy(state, {
        get: (target, prop) => target[prop],
        set: (target, prop, inputValue) => {
            if(prop === "value") {
                target[prop] = inputValue;
                target["subscribers"].forEach(subscriber => updateHook(subscriber, subscriber.rawDOM));

                // Uncomment the below for debugging
                // console.log("State: ", target[prop]);
            } else if(prop === "subscribers") {
                target[prop] = inputValue;
            }
            return true;
        }
    });

    return proxyState;
}

export const conditionalHook = (element, condition, trueDOM, falseDOM) => {
    const domElement = document.querySelector(element);

    domElement.rawDOM = domElement.innerHTML;
    domElement.trueDOM = trueDOM;
    domElement.falseDOM = falseDOM;

    condition.subscribers.push(domElement);

    domElement.innerHTML = condition.condition ? eval('`' + domElement.innerHTML + '`') : "";
    return domElement;
}

export const conditionalStore = (condition) => {
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

            return true;
        }
    });

    return proxyState;
}
// PowerJS ends here..
