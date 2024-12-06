import { BaseQueryApi, FetchArgs } from "@reduxjs/toolkit/query";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const customBaseQuery = async (
  args: string | FetchArgs,
  api: BaseQueryApi,
  extraOptions: any
) => {
  const baseQuery = fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
  });

  try {
    const result: any = await baseQuery(args, api, extraOptions);

    if (result.data) {
      result.data = result.data.data;
    }
    return result;

    return result;
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    return { error: { status: "FETCH_ERROR", error: errorMessage } };
  }
};

export const api = createApi({
  baseQuery: customBaseQuery,
  reducerPath: "api",
  tagTypes: ["Courses", "Users", "UserCourseProgress"],
  endpoints: (build) => ({
    getCourses: build.query<Course[], { category?: string }>({
      query: ({ category }) => ({
        url: "course",
        params: { category },
      }),
      providesTags: ["Courses"],
    }),

    getCourse: build.query<Course, string>({
      query: (id) => `courses/${id}`,
      providesTags: (result, error, id) => [{ type: "Courses", id }],
    }),
  }),
});

export const { useGetCoursesQuery, useGetCourseQuery } = api;
