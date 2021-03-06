import { LoaderProvider, useLoading } from "@agney/react-loading";
import React, { ReactElement } from "react";

function App() {
  const { containerProps, indicatorEl } = useLoading({
    loading: true,
  });
  return (
    <section className="p-1.5 flex justify-center" {...containerProps}>
      {indicatorEl}
    </section>
  );
}

interface ReactLoaderProps {
  component: ReactElement;
}

const ReactLoader: React.FC<ReactLoaderProps> = ({ component }) => {
  return (
    <LoaderProvider indicator={component}>
      <App />
    </LoaderProvider>
  );
};

export default ReactLoader;
