let currentComponent: symbol | undefined = undefined;
let currentIndex = 0;

export function setCurrentComponent(componentId: symbol) {
  currentComponent = componentId;
  currentIndex = 0;
}

export function getCurrent(): [symbol | undefined, number] {
  return [currentComponent, currentIndex];
}

export function incrementIndex() {
  currentIndex += 1;
}
