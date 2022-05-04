


import Head from "next/head";

export default function Home() {
  return (
    <div>
      <Head>
        <meta charset="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <title>Bottle App</title>
        <meta name="description" content="" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div id="canvasDisplay">
        <div id="canvasHolder">
          <div id="loading" className="hidden">
            <img src="/assets/images/loading.gif" width="100" />
          </div>
        </div>
        <div id="controls">
          <label htmlFor="bottles">Choose a bottle:</label>
          <select id="bottles">
            <option value="he">He</option>
            <option value="he5ml">He 5ml</option>
            <option value="they">They</option>
            <option value="they5ml">They 5ml</option>
            <option value="she">She</option>
            <option value="she5ml">She 5ml</option>
          </select>
          <hr />
          <label>Mouse controls:</label>
          <br />
          Scroll = zoom
          <br />
          Left click and drag = orbit
          <br />
          Right click = pan
          <hr />
        </div>
      </div>
    </div>
  );
}

