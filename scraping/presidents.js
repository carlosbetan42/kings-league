import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

(async () => {
  const STATIC_PATHS = path.join(process.cwd(), './assets/static/presidents');
  const DB_PATH = path.join(process.cwd(), './db/');
  const RAW_PRESIDENTS = await readFile(`${DB_PATH}/raw-presidents.json`, 'utf-8').then(JSON.parse);

  const presidents = await Promise.all(
    RAW_PRESIDENTS.map(async (presidentInfo) => {
      const { slug: id, title, _links: links } = presidentInfo;
      const { rendered: name } = title;

      const { 'wp:attachment': attachment } = links;
      const { href: imageApiEndpoint } = attachment[0];

      console.log('> Fetching image for president: ', name);

      const responseImageEndpoint = await fetch(imageApiEndpoint);
      const data = await responseImageEndpoint.json();
      const [imageInfo] = data;
      const {
        guid: { rendered: imageUrl }
      } = imageInfo;

      const fileExtension = imageUrl.split('.').at(-1);

      console.log('> Fetching image for president: ', name);

      // fetch image and save it to the filesystem
      const responseImage = await fetch(imageUrl);
      const arrayBuffer = await responseImage.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      console.log('>writing image to disk: ', name);
      const imageFileName = `${id}.${fileExtension}`;
      await writeFile(`${STATIC_PATHS}/${imageFileName}`, buffer);

      console.log('>everything is done: ', name);
      return { id, name, image: imageFileName, teamId: 0 };
    })
  );

  console.log('>All presidents are done');
  await writeFile(`${DB_PATH}/presidents.json`, JSON.stringify(presidents, null, 2), 'utf-8');
})();
