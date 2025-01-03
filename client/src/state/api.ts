import { BaseQueryApi, FetchArgs } from "@reduxjs/toolkit/query";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { User } from "@clerk/nextjs/server";
import { Clerk } from "@clerk/clerk-js";
import { toast } from "sonner";
const customBaseQuery = async (
  args: string | FetchArgs,
  api: BaseQueryApi,
  extraOptions: any
) => {
  const baseQuery = fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
    prepareHeaders: async (headers) => {
      const token = await window.Clerk?.session?.getToken();
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  });

  try {
    const result: any = await baseQuery(args, api, extraOptions);

    if (result.error) {
      const errorData = result.error.data;
      const errorMessage =
        errorData?.message ||
        result.error.status.toString() ||
        "An error occurred";
      toast.error(`Error: ${errorMessage}`);
    }

    const isMutationRequest =
      (args as FetchArgs).method && (args as FetchArgs).method !== "GET";

    if (isMutationRequest) {
      const successMessage = result.data?.message;
      if (successMessage) toast.success(successMessage);
    }

    if (result.data) {
      result.data = result.data.data;
    } else if (
      result.error?.status === 204 ||
      result.meta?.response?.status === 24
    ) {
      return { data: null };
    }

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
    /* 
    ===============
    USER CLERK
    =============== 
    */
    updateUser: build.mutation<User, Partial<User> & { userId: string }>({
      query: ({ userId, ...updatedUser }) => ({
        url: `user/clerk/${userId}`,
        method: "PUT",
        body: updatedUser,
      }),
      invalidatesTags: ["Users"],
    }),

    /* 
    ===============
    COURSES
    =============== 
    */

    getCourses: build.query<Course[], { category?: string }>({
      query: ({ category }) => ({
        url: "course",
        params: { category },
      }),
      providesTags: ["Courses"],
    }),

    getCourse: build.query<Course, string>({
      query: (id) => `course/${id}`,
      providesTags: (result, error, id) => [{ type: "Courses", id }],
    }),

    createCourse: build.mutation<
      Course,
      { teacherId: string; teacherName: string }
    >({
      query: (body) => ({
        url: `course`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Courses"],
    }),

    updateCourse: build.mutation<
      Course,
      { courseId: string; formData: FormData }
    >({
      query: ({ courseId, formData }) => ({
        url: `course/${courseId}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: (result, error, { courseId }) => [
        { type: "Courses", id: courseId },
      ],
    }),

    deleteCourse: build.mutation<{ message: string }, string>({
      query: (courseId) => ({
        url: `course/${courseId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Courses"],
    }),

    getUploadVideoUrl: build.mutation<
      { uploadUrl: string; videoUrl: string },
      {
        fileName: string;
        fileType: string;
      }
    >({
      query: ({ fileName, fileType }) => ({
        url: `course/get-upload-video-url`,
        method: "POST",
        body: { fileName, fileType },
      }),
    }),

    /* 
    ===============
    TRANSACTIONS
    =============== 
    */

    getTransactions: build.query<Transaction[], string>({
      query: (userId) => `transaction?userId=${userId}`,
    }),

    createStripePaymentIntent: build.mutation<
      { clientSecret: string },
      { amount: number }
    >({
      query: ({ amount }) => ({
        url: `/transaction/stripe/payment-intent`,
        method: "POST",
        body: { amount },
      }),
    }),

    createTransaction: build.mutation<Transaction, Partial<Transaction>>({
      query: (transaction) => ({
        url: "transaction",
        method: "POST",
        body: transaction,
      }),
    }),

    /* 
    ===============
    USER COURSE PROGRESS
    =============== 
    */
    getUserEnrolledCourses: build.query<Course[], string>({
      query: (userId) => `user/course-progress/${userId}/enrolled-courses`,
      providesTags: ["Courses", "UserCourseProgress"],
    }),
    getUserCourseProgress: build.query<
      UserCourseProgress,
      { userId: string; courseId: string }
    >({
      query: ({ userId, courseId }) =>
        `user/course-progress/${userId}/courses/${courseId}`,
      providesTags: ["UserCourseProgress"],
    }),

    updateUserCourseProgress: build.mutation<
      UserCourseProgress,
      {
        userId: string;
        courseId: string;
        progressData: {
          sections: SectionProgress[];
        };
      }
    >({
      query: ({ userId, courseId, progressData }) => ({
        url: `user/course-progress/${userId}/courses/${courseId}`,
        method: "PUT",
        body: progressData,
      }),
      invalidatesTags: ["UserCourseProgress"],
      async onQueryStarted(
        { userId, courseId, progressData },
        { dispatch, queryFulfilled }
      ) {
        const patchResult = dispatch(
          api.util.updateQueryData(
            "getUserCourseProgress",
            { userId, courseId },
            (draft) => {
              Object.assign(draft, {
                ...draft,
                sections: progressData.sections,
              });
            }
          )
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),
  }),
});

export const {
  useGetCoursesQuery,
  useGetCourseQuery,
  useUpdateUserMutation,
  useCreateStripePaymentIntentMutation,
  useCreateTransactionMutation,
  useGetTransactionsQuery,
  useCreateCourseMutation,
  useUpdateCourseMutation,
  useDeleteCourseMutation,
  useGetUploadVideoUrlMutation,
  useGetUserEnrolledCoursesQuery,
  useGetUserCourseProgressQuery,
  useUpdateUserCourseProgressMutation,
} = api;
