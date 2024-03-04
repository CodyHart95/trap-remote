export const calculateButtonPosition = (parent: Element, buttonDef: ButtonDefinition) => {
    const parentRect = parent.getBoundingClientRect();

    // Calculate the new absolute position of the button
    const absolutePositionX = (buttonDef.position.x / 100) * parentRect.width + parentRect.left;
    const absolutePositionY = (buttonDef.position.y / 100) * parentRect.height + parentRect.top;

    return { x: absolutePositionX, y: absolutePositionY}
}