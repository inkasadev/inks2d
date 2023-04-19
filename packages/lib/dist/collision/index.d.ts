import { P as Point, D as DisplayObject } from "../DisplayObject-023e134d.js";
import { L as Line, C as Circle, T as Triangle } from "../Triangle-78cb5992.js";
import { R as Rectangle } from "../Rectangle-15a3786c.js";
import "../Vector2D-7326dc95.js";

/**
 * Checks for a collision against a Point and a DisplayObject
 *
 *
 * @param point A Point object.
 * @param obj A DisplayObject.
 * @param global If the function should use global coordinates. Default False
 *
 */
declare const hitTestPoint: (
	point: Point,
	obj: DisplayObject,
	global?: boolean,
) => {
	hasContact: boolean;
};
/**
 * Checks for a collision between two Lines.
 *
 *
 * @param l1 A Line object.
 * @param l2 A Line object.
 */
declare const hitTestLine: (
	l1: Line,
	l2: Line,
) => {
	hasContact: boolean;
	overlap?: Point;
};
/**
 * Checks for a collision against a Line and a Point.
 *
 *
 * @param l1 A Line object.
 * @param p1 A Point object.
 */
declare const hitTestLinePoint: (
	l1: Line,
	p1: Point,
) => {
	hasContact: boolean;
};
/**
 * Checks for a collision against a Line and a Circle.
 *
 *
 * @param l1 A Line object.
 * @param c1 A Circle object.
 * @param solid If the Line should be solid. Default False
 * @param slope If the Circle should slide across the Line. Default False
 * @param bounce If the Circle should bounce across the Line. Default False
 */
declare const hitTestLineCircle: (
	l1: Line,
	c1: Circle,
	solid?: boolean,
	slope?: boolean,
	bounce?: boolean,
) => {
	hasContact: boolean;
	overlap?: Point | undefined;
	side?: string | undefined;
};
/**
 * Checks for a collision against a Line and a Rectangle.
 *
 * @param l1 A Line object.
 * @param r1 A Rectangle object.
 * @param solid If the Line should be solid. Default False
 * @param slope If the Rectangle should slide across the Line. Default False
 * @param bounce If the Rectangle should bounce across the Line. Default False
 */
declare const hitTestLineRectangle: (
	l1: Line,
	r1: Rectangle,
	solid?: boolean,
	slope?: boolean,
	bounce?: boolean,
) => {
	hasContact: boolean;
	overlap?: Point | undefined;
	side?: string | undefined;
};
/**
 * Checks for a collision between two Circles.
 *
 *
 * @param c1 A Circle object.
 * @param c2 A Circle object.
 * @param global If the function should use global coordinates. Default False
 * @param solid If the Objects should be solid. Default False
 * @param bounce If the Objects should bounce across each other. Default False
 * @param reactive If the Objects should be reactive across each other. Default False
 */
declare const hitTestCircle: (
	c1: Circle,
	c2: Circle,
	global?: boolean,
	solid?: boolean,
	bounce?: boolean,
	reactive?: boolean,
) => {
	hasContact: boolean;
	overlap?: number | undefined;
};
/**
 * Checks for a collision between two Rectangles.
 *
 *
 * @param r1 A Rectangle object.
 * @param r2 A Rectangle object.
 * @param global If the function should use global coordinates. Default False
 * @param solid If the Objects should be solid. Default False
 * @param bounce If the Objects should bounce across each other. Default False
 * @param reactive If the Objects should be reactive across each other. Default False
 */
declare const hitTestRectangle: (
	r1: Rectangle,
	r2: Rectangle,
	global?: boolean,
	solid?: boolean,
	bounce?: boolean,
) => {
	hasContact: boolean;
	overlap?: Point | undefined;
	side?: string | undefined;
};
/**
 * Checks for a collision between a Circle and a Rectangle.
 *
 * @param c1 A Circle object.
 * @param r1 A Rectangle object.
 * @param global If the function should use global coordinates. Default False
 * @param solid If the Objects should be solid. Default False
 * @param bounce If the Objects should bounce across each other. Default False
 */
declare const hitTestCircleRectangle: (
	c1: Circle,
	r1: Rectangle,
	global?: boolean,
	solid?: boolean,
	bounce?: boolean,
) => {
	hasContact: boolean;
	overlap?: Point | number;
	side?: string;
};
/**
 * Checks for a collision between a Circle and a Triangle.
 *
 * @param c1 A Circle object.
 * @param t1 A Triangle object.
 * @param solid If the Objects should be solid. Default False
 * @param slope If the Circle should slide across the Triangle hypotenuse. Default False
 * @param bounce If the Circle should bounce across the Triangle hypotenuse. Default False
 */
declare const hitTestCircleTriangle: (
	c1: Circle,
	t1: Triangle,
	solid?: boolean,
	slope?: boolean,
	bounce?: boolean,
) => {
	hasContact: boolean;
	overlap?: Point | number;
	side?: string;
};
/**
 * Checks for a collision between a Circle and a Triangle.
 *
 * @param c1 A Circle object.
 * @param t1 A Triangle object.
 * @param solid If the Objects should be solid. Default False
 * @param slope If the Circle should slide across the Triangle hypotenuse. Default False
 * @param bounce If the Circle should bounce across the Triangle hypotenuse. Default False
 */
declare const hitTestRectangleTriangle: (
	r1: Rectangle,
	t1: Triangle,
	solid?: boolean,
	slope?: boolean,
	bounce?: boolean,
) => {
	hasContact: boolean;
};

export {
	hitTestCircle,
	hitTestCircleRectangle,
	hitTestCircleTriangle,
	hitTestLine,
	hitTestLineCircle,
	hitTestLinePoint,
	hitTestLineRectangle,
	hitTestPoint,
	hitTestRectangle,
	hitTestRectangleTriangle,
};
