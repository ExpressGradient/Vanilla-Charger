// PowerJS starts here..
import  * as data  from './main.js';

export const hook = (element) => {
    const domElement = document.querySelector(element);
    domElement.innerHTML = eval('`' + domElement.innerHTML + '`');
    reactiveHook();
    return domElement;
}

export const statefulHook = (element, store) => {
    const domElement = document.querySelector(element);
    domElement.rawDOM = domElement.innerHTML;

    store.subscribers.push(domElement);

    domElement.innerHTML = eval('`' + domElement.innerHTML + '`');
    reactiveHook();
    return domElement;
}

const updateHook = (hook, updateDOM) => {
    hook.innerHTML = eval('`' + updateDOM + '`');
    reactiveHook();
}

export const inject = (from, to) => {
    to.innerHTML += from.innerHTML;
    reactiveHook();
}

export const store = (value) => {
    let state = {
        value,
        subscribers: []
    };

    return new Proxy(state, {
        get: (target, prop) => target[prop],
        set: (target, prop, inputValue) => {
            if (prop === "value") {
                target[prop] = inputValue;
                target["subscribers"].forEach(subscriber => updateHook(subscriber, subscriber.rawDOM));

                reactiveHook();
                // Uncomment the below for debugging
                // console.log("State: ", target[prop]);
            } else if (prop === "subscribers") {
                target[prop] = inputValue;
            }
            return true;
        }
    });
}

export const conditionalHook = (element, condition, trueDOM, falseDOM) => {
    const domElement = document.querySelector(element);

    domElement.rawDOM = domElement.innerHTML;
    domElement.trueDOM = trueDOM.innerHTML;
    domElement.falseDOM = falseDOM.innerHTML;

    condition.subscribers.push(domElement);

    domElement.innerHTML = condition.condition ? eval('`' + domElement.trueDOM + '`') : eval('`' + domElement.falseDOM + '`');
    reactiveHook();
    return domElement;
}

export const conditionalStore = (condition) => {
    let state = {
        condition,
        subscribers: []
    };

    return new Proxy(state, {
        get: (target, prop) => target[prop],
        set: (target, prop, value) => {
            target[prop] = value;

            if (prop === "condition") {
                // Uncomment the below line for debugging
                // console.log("Condition: ", target[prop]);

                target["subscribers"].forEach(subscriber => {
                    target["condition"] ? updateHook(subscriber, subscriber.trueDOM) : updateHook(subscriber, subscriber.falseDOM);
                });

                reactiveHook();
            }

            return true;
        }
    });
}

export const loopHook = (element, data) => {
    const loopElement = document.querySelector(element);
    loopElement.itemDOM = loopElement.innerHTML;
    loopElement.innerHTML = "";

    data.forEach(item => {
        loopElement.innerHTML += eval('`' + loopElement.itemDOM + '`');
        reactiveHook();
    });

    return loopElement;
}

export const asyncStore = (asyncData) => {
    let state = {
        value: asyncData,
        subscribers: []
    }

    return new Proxy(state, {
        get: (target, prop) => target[prop],
        set: (target, prop, setValue) => {
            target[prop] = setValue;

            if(prop === 'value') {
                target['subscribers'].forEach(subscriber => subscriber.innerHTML = eval('`' + subscriber.asyncItem + '`'));

                reactiveHook();
            }

            return true;
        }
    });
}

export const asyncHook = (element, asyncStore, placeHolder, asyncItem) => {
    const asyncElement = document.querySelector(element);
    const placeHolderDOM = document.querySelector(placeHolder);
    const asyncItemDOM = document.querySelector(asyncItem);
    asyncElement.placeHolder = placeHolderDOM.innerHTML;
    asyncElement.asyncItem = asyncItemDOM.innerHTML;
    asyncElement.innerHTML = asyncElement.placeHolder;

    asyncStore['subscribers'].push(asyncElement);

    reactiveHook();

    return asyncElement;
}

export const reactiveFunctions = [];

export const reactiveFunction = (fn) => reactiveFunctions.push(fn);

export const reactiveHook = () => {
    reactiveFunctions.forEach(fn => fn());
}
// PowerJS ends here..
