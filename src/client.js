import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

export const client = createClient({
	projectId: 'ias37b5e',
	dataset: 'production',
	apiVersion: '2023-04-12',
	useCdn: false,
	token:
		'sk4N9y9E9pELrShGuze5OL6EsAoF9aYUqHo4HSIf2D3DgmIhuGzBJ1zws4lIYtXg1691bloymCCjikLjZhgXvVLitDqnihyFmg7w4tWX7vOnF9hfmJkdOdUsWml9wEhtnKpLCBmyicZjXDOqurs21VBS8ziRDAhyAXbb2huU6MCy9e5SPlbV',
});

const builder = imageUrlBuilder(client);

export const urlFor = (source) => builder.image(source);
