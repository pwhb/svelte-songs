// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global
{
	namespace App
	{
		// interface Error {}
		interface Locals
		{
			user: {
				_id: ObjectId;
				username: string;
				role: any;
			};
		}
		// interface PageData {}
		// interface Platform {}
	}
}

export { };
