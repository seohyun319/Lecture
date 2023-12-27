import { useQuery } from "@tanstack/react-query";
import axios from "axios";

type GithubAPIResponse = {
  name: string;
  description: string;
  subscribers_count: number;
  stargazers_count: number;
  forks_count: number;
};

type GithubAPIError = {
  message: string; // e.g. "Not Found",
  documentation_url: string; // e.g. "https://docs.github.com/rest/repos/repos#get-a-repository"
};

const Example: React.FC = () => {
  const { isLoading, error, data, isFetching } = useQuery<
    GithubAPIResponse,
    GithubAPIError
  >({
    queryKey: ["repoData"],
    queryFn: () =>
      axios
        .get("https://api.github.com/repos/tannerlinsley/react-query")
        .then((res) => res.data),
  });

  if (isLoading) return "Loading...";

  if (error) return `An error has occurred: ${error.message}`;

  return (
    <div>
      <h1>{data.name}</h1>
      <p>{data.description}</p>
      <strong>👀 {data.subscribers_count}</strong>{" "}
      <strong>✨ {data.stargazers_count}</strong>{" "}
      <strong>🍴 {data.forks_count}</strong>
      <div>{isFetching ? "Updating..." : ""}</div>
    </div>
  );
};

export default Example;
