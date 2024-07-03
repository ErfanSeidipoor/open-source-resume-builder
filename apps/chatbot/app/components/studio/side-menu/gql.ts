import { gql } from "@apollo/client";

export const QUERY_GET_RESUMES_RESUME = gql`
  query getResumes(
    $getResumesResumeArgs: GetResumesResumeArgsGQL!
    $paginationArgs: PaginationArgsGQL!
  ) {
    getResumes(
      getResumesResumeArgs: $getResumesResumeArgs
      paginationArgs: $paginationArgs
    ) {
      edges {
        id
        title
        userId
      }
      pageInfo {
        totalEdges
        edgeCount
        edgesPerPage
        totalPages
        currentPage
      }
    }
  }
`;
