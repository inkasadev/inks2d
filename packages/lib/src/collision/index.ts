import { type DisplayObject } from "DisplayObject";
import { Vector2D, Point } from "inks2d/math";
import { Circle, type Rectangle, type Triangle, Line } from "inks2d/geom";

/**
 * Checks for a collision against a Point and a DisplayObject
 *
 *
 * @param point A Point object.
 * @param obj A DisplayObject.
 * @param global If the function should use global coordinates. Default False
 *
 */
export const hitTestPoint = (
	point: Point,
	obj: DisplayObject,
	global: boolean = false,
): { hasContact: boolean } => {
	let bounds = obj.localBounds();
	let centerX = obj.localCenterX;
	let centerY = obj.localCenterY;

	if (global) {
		bounds = obj.globalBounds();
		centerX = obj.globalCenterX;
		centerY = obj.globalCenterY;
	}

	if (!(obj instanceof Circle)) {
		/*
		const left = obj.position.x + bounds.x - bounds.width * obj.pivot.x;
		const right = left + bounds.width;
		const top = obj.position.y + bounds.y - bounds.height * obj.pivot.y;
		const bottom = top + bounds.height;
		*/

		const left = bounds.x - obj.width * obj.pivot.x;
		const right = left + bounds.width;
		const top = bounds.y - obj.height * obj.pivot.y;
		const bottom = top + bounds.height;

		return {
			hasContact:
				point.x > left && point.x < right && point.y > top && point.y < bottom,
		};
	}

	if (obj instanceof Circle) {
		const vec = new Vector2D(
			new Point(centerX, centerY),
			new Point(point.x, point.y),
		);

		return { hasContact: vec.length < obj.radius };
	}

	return { hasContact: false };
};

/**
 * Checks for a collision between two Lines.
 *
 *
 * @param l1 A Line object.
 * @param l2 A Line object.
 */
export const hitTestLine = (
	l1: Line,
	l2: Line,
): { hasContact: boolean; overlap?: Point } => {
	const x = (l2.yIntercepts - l1.yIntercepts) / (l1.slope - l2.slope);
	const y = l1.slope * x + l1.yIntercepts;
	const point = new Point(x, y);

	if (
		hitTestLinePoint(l1, point).hasContact &&
		hitTestLinePoint(l2, point).hasContact
	) {
		return { hasContact: true, overlap: point };
	}

	return { hasContact: false };
};

/**
 * Checks for a collision against a Line and a Point.
 *
 *
 * @param l1 A Line object.
 * @param p1 A Point object.
 */
export const hitTestLinePoint = (
	l1: Line,
	p1: Point,
): { hasContact: boolean } => {
	const v1 = new Vector2D(l1.a.clone(), l1.b.clone());
	const v2 = new Vector2D(l1.a.clone(), p1.clone());
	const v3 = new Vector2D(p1.clone(), l1.b.clone());

	return { hasContact: v1.length > v2.length && v1.length > v3.length };
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
export const hitTestLineCircle = (
	l1: Line,
	c1: Circle,
	solid: boolean = false,
	slope: boolean = false,
	bounce: boolean = false,
): {
	hasContact: boolean;
	overlap?: Point;
	side?: string;
} => {
	const v0 = new Vector2D(l1.a.clone(), l1.b.clone());
	const v1 = new Vector2D(c1.position.clone(), l1.a.clone());
	const v2 = new Vector2D(c1.position.clone(), new Point());

	const pdp1 = Math.round(v1.perpDotProd(v0));
	let side = "";

	if (pdp1 > 0) {
		side = "left";
	} else if (pdp1 < 0) {
		side = "right";
	}

	if (side === "" || side === "left") {
		v2.b.set(
			c1.position.x + v0.rightNormal.normalized.x * c1.radius,
			c1.position.y + v0.rightNormal.normalized.y * c1.radius,
		);
	} else {
		v2.b.set(
			c1.position.x + v0.leftNormal.normalized.x * c1.radius,
			c1.position.y + v0.leftNormal.normalized.y * c1.radius,
		);
	}

	const v3 = new Vector2D(
		v2.b.clone(),
		new Point(v2.b.x + c1.velocity.x, v2.b.y + c1.velocity.y),
	);

	const v4 = new Vector2D(v3.a.clone(), v0.a.clone());

	const dp1 = v4.dotProd(v0.leftNormal);

	if ((dp1 > 0 && side === "left") || (dp1 < 0 && side === "right")) {
		if (hitTestLinePoint(l1, v3.a.clone()).hasContact) {
			const overlapX = v3.normalized.x * Math.abs(dp1);
			const overlapY = v3.normalized.y * Math.abs(dp1);

			if (solid) {
				c1.position = c1.position.subtract(new Point(overlapX, overlapY));
			}

			if (slope) {
				/*
				let frictionY = c1.friction.y;

				if (c1.velocity.y > 0) {
					frictionY = 1.05;
				}

				let bounceOff = this.bounceOff(c1, v0);
				bounceOff = bounceOff.multiply(frictionY);
				*/
				// console.log(bounceOff);
				// c1.position = c1.position.add(bounceOff);
				c1.position = c1.position.add(bounceOff(c1, v0));
			}

			if (slope) if (bounce) c1.velocity = bounceOff(c1, v0);

			return {
				hasContact: true,
				overlap: new Point(overlapX, overlapY),
				side,
			};
		}
	}

	return { hasContact: false };
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
export const hitTestLineRectangle = (
	l1: Line,
	r1: Rectangle,
	solid: boolean = false,
	slope: boolean = false,
	bounce: boolean = false,
): {
	hasContact: boolean;
	overlap?: Point;
	side?: string;
} => {
	const v0 = new Vector2D(l1.a.clone(), l1.b.clone());

	/*
	 * Create a distance vector between the center of the
	 * rectangle and the center of the triangle;
	 */
	const v1 = new Vector2D(l1.a.clone(), r1.position);

	const pdp1 = Math.round(v1.perpDotProd(v0));
	let side = "";

	if (pdp1 > 0) {
		side = "right";
	} else if (pdp1 < 0) {
		side = "left";
	}

	/*
	 * Project the distance vector onto the hypotenuse’s
	 * normal;
	 */
	const v1P = v1.projection(v0.leftNormal);

	/*
	 * Position the projection so that it starts at
	 * point A of the hypotenuse’s left normal and
	 * extends as far as the projection’s vx and vy;
	 */

	/**
	 * BEGIN: Rectangle Specific;
	 */
	/*
	 * Finds the square’s half height and half width
	 * vectors;
	 */
	const r1W = new Vector2D(new Point(0, 0), new Point(r1.halfWidth, 0));
	const r1H = new Vector2D(new Point(0, 0), new Point(0, r1.halfHeight));

	/*
	 * Projects the square’s half height and
	 * half width vectors onto the hypotenuse’s normal;
	 */
	const r1Wp = r1W.projection(v0.leftNormal);
	const r1Hp = r1H.projection(v0.leftNormal);
	if (side === "left") r1Wp.reverse();

	/*
	 * The distance between the square and the hypotenuse
	 * is equal to the projection of the distance vector
	 * minus the projection of the shape’s half width
	 * and half height.
	 */
	const r1P = new Vector2D(
		new Point(v0.leftNormal.a.x + v1P.vx, v0.leftNormal.a.y + v1P.vy),
		new Point(
			v0.leftNormal.a.x + v1P.vx - (r1Wp.vx - r1Hp.vx),
			v0.leftNormal.a.y + v1P.vy - (r1Wp.vy - r1Hp.vy),
		),
	);
	/**
	 * END: Rectangle Specific;
	 */

	/*
	 * Create a vector to represent the distance between
	 * the square and the hypotenuse;
	 */
	const hDistance = new Vector2D(
		v0.leftNormal.a.clone(),
		new Point(
			v0.leftNormal.a.x - v1P.vx - r1P.vx,
			v0.leftNormal.a.y - v1P.vy - r1P.vy,
		),
	);

	/*
	 * Find the dot product between the hDistance and
	 * the hypotenuse’s left normal. It will help us
	 * to check whether the two shapes are overlapping;
	 */
	const dp = hDistance.dotProd(v0.leftNormal);

	/*
	 * Check whether the projections are overlapping on
	 * the x axis;
	 */
	if ((dp > 0 && side === "left") || (dp < 0 && side === "right")) {
		const pos = r1.position.add(new Point(hDistance.vx, hDistance.vy));

		if (hitTestLinePoint(l1, pos).hasContact) {
			if (solid)
				r1.position = r1.position.add(new Point(hDistance.vx, hDistance.vy));

			if (slope) r1.position = r1.position.add(bounceOff(r1, v0));

			if (bounce) r1.velocity = bounceOff(r1, v0);

			return {
				hasContact: true,
				overlap: new Point(hDistance.vx, hDistance.vy),
				side,
			};
		}
	}

	return { hasContact: false };
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
export const hitTestCircle = (
	c1: Circle,
	c2: Circle,
	global: boolean = false,
	solid: boolean = false,
	bounce: boolean = false,
	reactive: boolean = false,
): {
	hasContact: boolean;
	overlap?: number;
} => {
	let overlap;

	const vec = new Vector2D(
		new Point(c1.localCenterX, c1.localCenterY),
		new Point(c2.localCenterX, c2.localCenterY),
	);

	const combinedRadius = c1.bounds.width / 2 + c2.bounds.width / 2;
	const hasCollide = vec.length < combinedRadius;

	if (global) {
		vec.a.x = c1.globalCenterX;
		vec.a.y = c1.globalCenterY;
		vec.b.x = c2.globalCenterX;
		vec.b.y = c2.globalCenterY;
	}

	if (solid && hasCollide) {
		overlap = combinedRadius - vec.length;

		if (!reactive) {
			c1.position.x -= overlap * vec.normalized.x;
			c1.position.y -= overlap * vec.normalized.y;
		} else {
			const vxHalf = Math.abs((vec.normalized.x * overlap) / 2);
			const vyHalf = Math.abs((vec.normalized.y * overlap) / 2);

			const xSide = c1.position.x > c2.position.x ? 1 : -1;
			const ySide = c1.position.y > c2.position.y ? 1 : -1;

			c1.position.x = c1.position.x + vxHalf * xSide;
			c1.position.y = c1.position.y + vyHalf * ySide;

			c2.position.x = c2.position.x + vxHalf * -xSide;
			c2.position.y = c2.position.y + vyHalf * -ySide;
		}

		if (bounce) {
			if (!reactive) {
				c1.velocity = bounceOff(c1, vec.leftNormal);
			} else {
				const c1V = new Vector2D(c1.position, c1.position.add(c1.velocity));
				const p1A = c1V.projection(vec);
				const p1B = c1V.projection(vec.leftNormal);

				const c2V = new Vector2D(c2.position, c2.position.add(c2.velocity));
				const p2A = c2V.projection(vec);
				const p2B = c2V.projection(vec.leftNormal);

				c1.velocity = new Point(
					(p1B.vx + p2A.vx) / c1.mass,
					(p1B.vy + p2A.vy) / c1.mass,
				);

				c2.velocity = new Point(
					(p1A.vx + p2B.vx) / c2.mass,
					(p1A.vy + p2B.vy) / c2.mass,
				);
			}
		}

		return {
			hasContact: true,
			overlap,
		};
	}

	return { hasContact: hasCollide };
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
export const hitTestRectangle = (
	r1: Rectangle,
	r2: Rectangle,
	global: boolean = false,
	solid: boolean = false,
	bounce: boolean = false,
): {
	hasContact: boolean;
	overlap?: Point;
	side?: string;
} => {
	let side: "top" | "right" | "bottom" | "left";

	const vec = new Vector2D(
		new Point(r2.localCenterX, r2.localCenterY),
		new Point(r1.localCenterX, r1.localCenterY),
	);

	if (global) {
		vec.a.x = r2.globalCenterX;
		vec.a.y = r2.globalCenterY;
		vec.b.x = r1.globalCenterX;
		vec.b.y = r1.globalCenterY;
	}

	const combinedHalfWidths = r1.bounds.width / 2 + r2.bounds.width / 2;
	const combinedHalfHeights = r1.bounds.height / 2 + r2.bounds.height / 2;

	if (Math.abs(vec.vx) < combinedHalfWidths) {
		if (Math.abs(vec.vy) < combinedHalfHeights) {
			const overlapX = combinedHalfWidths - Math.abs(vec.vx);
			const overlapY = combinedHalfHeights - Math.abs(vec.vy);

			if (overlapX >= overlapY) {
				if (vec.vy > 0) {
					side = "top";
					if (solid) r1.position.y = r1.position.y + overlapY;
				} else {
					side = "bottom";
					if (solid) r1.position.y = r1.position.y - overlapY;
				}

				if (solid && bounce) {
					r1.velocity.y *= -1;
					bounceOff(r1, vec.leftNormal);
				}
			} else {
				if (vec.vx > 0) {
					side = "left";
					if (solid) r1.position.x = r1.position.x + overlapX;
				} else {
					side = "right";
					if (solid) r1.position.x = r1.position.x - overlapX;
				}

				if (solid && bounce) {
					r1.velocity.x *= -1;
					bounceOff(r1, vec.leftNormal);
				}
			}

			return {
				hasContact: true,
				overlap: new Point(overlapX, overlapY),
				side,
			};
		}
	}

	return { hasContact: false };
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
export const hitTestCircleRectangle = (
	c1: Circle,
	r1: Rectangle,
	global: boolean = false,
	solid: boolean = false,
	bounce: boolean = false,
): {
	hasContact: boolean;
	overlap?: Point | number;
	side?: string;
} => {
	let region;

	const c1Pos = new Point(c1.position.x, c1.position.y);
	const r1Pos = new Point(r1.localCenterX, r1.localCenterY);

	if (c1Pos.y < r1Pos.y - r1.halfHeight) {
		if (c1Pos.x < r1Pos.x - 1 - r1.halfWidth) {
			region = "topLeft";
		} else if (c1Pos.x > r1Pos.x + 1 + r1.halfWidth) {
			region = "topRight";
		} else {
			region = "topMiddle";
		}
	} else if (c1Pos.y > r1Pos.y + r1.halfHeight) {
		if (c1Pos.x < r1Pos.x - 1 - r1.halfWidth) {
			region = "bottomLeft";
		} else if (c1Pos.x > r1Pos.x + 1 + r1.halfWidth) {
			region = "bottomRight";
		} else {
			region = "bottomMiddle";
		}
	} else {
		if (c1Pos.x < r1Pos.x - r1.halfWidth) {
			region = "leftMiddle";
		} else {
			region = "rightMiddle";
		}
	}

	if (
		region === "topMiddle" ||
		region === "bottomMiddle" ||
		region === "leftMiddle" ||
		region === "rightMiddle"
	) {
		return hitTestRectangle(c1, r1, global, solid, bounce);
	}

	const point = new Circle(0.1, 0.1);

	switch (region) {
		case "topLeft":
			point.position.x = r1.position.x - r1.width * r1.pivot.x;
			point.position.y = r1.position.y - r1.height * r1.pivot.y;
			break;
		case "topRight":
			point.position.x = r1.position.x - r1.width * r1.pivot.x + r1.width;
			point.position.y = r1.position.y - r1.height * r1.pivot.y;
			break;
		case "bottomLeft":
			point.position.x = r1.position.x - r1.width * r1.pivot.x;
			point.position.y = r1.position.y - r1.height * r1.pivot.y + r1.height;
			break;
		case "bottomRight":
			point.position.x = r1.position.x - r1.width * r1.pivot.x + r1.width;
			point.position.y = r1.position.y - r1.height * r1.pivot.y + r1.height;
			break;
	}

	return hitTestCircle(c1, point, false, solid, bounce, false);
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
export const hitTestCircleTriangle = (
	c1: Circle,
	t1: Triangle,
	solid: boolean = false,
	slope: boolean = false,
	bounce: boolean = false,
): {
	hasContact: boolean;
	overlap?: Point | number;
	side?: string;
} => {
	const hypotenuse = new Line(t1.hypotenuse.a.clone(), t1.hypotenuse.b.clone());

	const boxCollision = hitTestCircleRectangle(c1, t1, false, false, false);

	if (boxCollision.hasContact) {
		const { side } = boxCollision;

		const v0 = new Vector2D(
			new Point(c1.localCenterX, c1.localCenterY),
			hypotenuse.a.clone(),
		);

		const hypotenuseSide = t1.hypotenuse.perpDotProd(v0);

		if (t1.inclination === "right") {
			if (side === "right" || (side === "top" && hypotenuseSide > 0)) {
				return hitTestCircleRectangle(c1, t1, false, solid, bounce);
			}

			const hypotenuseCollide = hitTestLineCircle(
				hypotenuse,
				c1,
				solid,
				slope,
				bounce,
			);

			if (hypotenuseCollide.hasContact)
				return { ...hypotenuseCollide, side: "hypotenuse" };

			return hypotenuseCollide;
		}

		if (side === "left" || (side === "top" && hypotenuseSide > 0)) {
			return hitTestCircleRectangle(c1, t1, false, solid, bounce);
		}

		const hypotenuseCollide = hitTestLineCircle(
			hypotenuse,
			c1,
			solid,
			slope,
			bounce,
		);

		if (hypotenuseCollide.hasContact)
			return { ...hypotenuseCollide, side: "hypotenuse" };

		return hypotenuseCollide;
	}

	return boxCollision;
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
export const hitTestRectangleTriangle = (
	r1: Rectangle,
	t1: Triangle,
	solid: boolean = false,
	slope: boolean = false,
	bounce: boolean = false,
): { hasContact: boolean } => {
	const boxCollision = hitTestRectangle(r1, t1, false, false, false);

	if (boxCollision.hasContact) {
		const { side } = boxCollision;
		let hypotenuse = new Line(t1.hypotenuse.b.clone(), t1.hypotenuse.a.clone());

		if (t1.inclination === "right") {
			if (side === "right" || side === "top") {
				return hitTestRectangle(r1, t1, false, solid, bounce);
			}

			return hitTestLineRectangle(hypotenuse, r1, solid, slope, bounce);
		}

		hypotenuse = new Line(t1.hypotenuse.a.clone(), t1.hypotenuse.b.clone());

		if (side === "left" || side === "top") {
			return hitTestRectangle(r1, t1, false, solid, bounce);
		}

		return hitTestLineRectangle(hypotenuse, r1, solid, slope, bounce);
	}

	return boxCollision;
};

const bounceOff = (obj: DisplayObject, surface: Vector2D): Point => {
	const pos = new Vector2D(
		obj.position.clone(),
		obj.position.add(obj.velocity),
	);

	const p1 = pos.projection(surface);
	const p2 = pos.projection(surface.leftNormal);
	p2.reverse();

	return new Point((p1.vx + p2.vx) / obj.mass, (p1.vy + p2.vy) / obj.mass);
};
