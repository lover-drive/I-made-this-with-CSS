export type float3 = [number, number, number]

export default class Float3 {

	public x: number
	public y: number
	public z: number

	public constructor (x: number, y: number, z: number) {
		this.x = x
		this.y = y
		this.z = z
	}

	public add (other: Float3): Float3 {
		return new Float3(this.x + other.x, this.y + other.y, this.z + other.z)
	}

	public subtract (other: Float3): Float3 {
		return new Float3(this.x - other.x, this.y - other.y, this.z - other.z)
	}

	public multiply (other: Float3 | number): Float3 {
		if (typeof (other) == 'number')
 			return new Float3(this.x * other, this.y * other, this.z * other)

		return new Float3(this.x * other.x, this.y * other.y, this.z * other.z)
	}

	public invert (): Float3 {
		return this.multiply(-1)
	}

}
