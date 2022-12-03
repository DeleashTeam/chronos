/* eslint-disable no-plusplus */
const Line = ({ id }) => <div key={id} className="h-8 bg-gray-200 rounded-full dark:bg-purple-400 mb-2.5"></div>;

const Loading = ({ count = 2, additional = true }) => {
  const lines = [];
  for (let i = 0; i < count; i++) {
    lines.push(<Line id={i} key={i} />);
  }
  return (
    <div role="status" className="space-y-6 p-4 max-w-sm ml-5 animate-pulse">
      {lines.map((line) => line)}
      {additional ? (
        <div className="flex justify-center items-center mt-4">
          <div className="w-20 h-4 bg-gray-200 rounded-full dark:bg-purple-400 mr-20"></div>
          <div className="w-20 h-4 bg-gray-200 rounded-full dark:bg-purple-400"></div>
        </div>
      ) : null}
      <div className="h-8 bg-gray-200 rounded-full dark:bg-purple-400 m-5"></div>
    </div>
  );
};

export default Loading;
