import { Suspense } from "react";
import { Await, useLoaderData } from "react-router-dom";

import Filter from "../../components/filter/Filter";
import Card from "../../components/card/Card";
import Map from "../../components/map/Map";

import "./listPage.scss";

function ListPage() {
  const posts = useLoaderData();

  const { postResponse } = posts;

  return (
    <div className="listPage">
      <div className="listContainer">
        <div className="wrapper">
          <Filter />
          <Suspense fallback={<p>Loading...</p>}>
            <Await
              resolve={postResponse}
              errorElement={<p>Error loading post</p>}
            >
              {(postResponse) =>
                postResponse.data.map((p) => <Card key={p.id} item={p} />)
              }
            </Await>
          </Suspense>
        </div>
      </div>
      <div className="mapContainer">
        <Suspense fallback={<p>Loading...</p>}>
          <Await
            resolve={postResponse}
            errorElement={<p>Error loading post</p>}
          >
            {(postResponse) =>
              postResponse.data.map((p) => (
                <Map key={p.id} items={postResponse.data} />
              ))
            }
          </Await>
        </Suspense>
      </div>
    </div>
  );
}

export default ListPage;
