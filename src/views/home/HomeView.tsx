import React, { useEffect } from "react";
import { useReduxDispatch } from "src/app/hook";
import { fetchPosts } from "src/slices/postSlice";
import Page from "src/components/Page";
import Results from "./Results";

const HomeView = () => {
  const dispatch = useReduxDispatch();

  useEffect(() => {
    dispatch(fetchPosts());

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Page>
      <div className="p-2 md:w-4/5 md:mx-auto md:p-0">
        <Results />
      </div>
    </Page>
  );
};

export default HomeView;
