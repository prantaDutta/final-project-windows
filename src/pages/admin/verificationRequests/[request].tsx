import { ThreeDots } from "@agney/react-loading";
import axios from "axios";
import { NextPageContext } from "next";
import { withIronSession } from "next-iron-session";
import Image from "next/image";
import React, { useState } from "react";
import useSWR, { mutate } from "swr";
import DashboardLayout from "../../../components/layouts/DashboardLayout";
import ReactLoader from "../../../components/ReactLoader";
import {
  BASE_URL,
  isProduction,
  NEXT_IRON_SESSION_CONFIG,
  uuidFormatRegex,
} from "../../../utils/constants";
import {
  downloadImage,
  redirectToErrorPage,
  redirectToLogin,
} from "../../../utils/functions";
import { ModifiedUserData } from "../../../utils/randomTypes";

interface requestProps {
  user: ModifiedUserData;
  request: string;
}

interface ShowMultipleImageProps {
  photo: Array<any>;
}

const ShowMultipleImage: React.FC<ShowMultipleImageProps> = ({ photo }) => {
  const statements = (photo[1] as any).split("#");
  statements.splice(-1, 1);
  statements.map((statement: string) => {
    return (
      <ShowImage
        key={statement}
        name="BankAccount Statements"
        url={statement}
      />
    );
  });
  return <></>;
};

interface ShowImageProps {
  name: string;
  url: string;
}

const ShowImage: React.FC<ShowImageProps> = ({ name, url }) => {
  return (
    <tr key={name}>
      <td className="font-semibold border px-8 py-4">{name}</td>
      <td className="font-semibold border px-8 py-4">
        <Image
          height="100"
          width="100"
          className=""
          alt={name}
          src={`/uploads/verificationPapers/${url}`}
        />
        <span
          onClick={() =>
            downloadImage(
              BASE_URL + `/uploads/verificationPapers/${url}`,
              url as string
            )
          }
          className="text-md block text-primary cursor-pointer"
        >
          Download Image
        </span>
      </td>
    </tr>
  );
};

const request: React.FC<requestProps> = ({ user, request }) => {
  const [submitting, setSubmitting] = useState<boolean>(false);
  const { data, isValidating } = useSWR(
    BASE_URL + `/api/admin/verification-requests/${request}`
  );
  let photos = data?.verificationPhotos
    ? Object.entries(data?.verificationPhotos)
    : null;

  const bankStatements = data?.verificationPhotos?.bankAccountStateMents
    ? data?.verificationPhotos?.bankAccountStateMents
    : null;
  if (photos) delete (photos as any)?.bankAccountStateMents;
  let statementsArray = bankStatements ? bankStatements.split("#") : null;
  if (statementsArray) {
    statementsArray.splice(-1, 1);
    statementsArray.map((state: any, i: number) => {
      photos?.push(["bankAccountStatements " + (i + 1).toString(), state]);
    });
  }
  const email = data?.email ? data?.email : null;
  const userId = data?.userId ? data?.userId : null;
  return (
    <DashboardLayout data={user}>
      <div className="my-10 mx-16">
        <div className="text-gray-900 bg-gray-200">
          <div className="p-4 flex justify-between">
            <h1 className="text-3xl">Verification Check</h1>
            <button
              onClick={async () => {
                setSubmitting(true);
                const { data } = await axios.post(
                  BASE_URL + "/api/admin/verification-requests/update",
                  {
                    email,
                  }
                );
                if (isProduction) console.log(data);
                setSubmitting(false);
                mutate(`/admin/verificationRequests/${userId}`);
              }}
              className="bg-primary text-white p-3 w-1/3 rounded-full tracking-wide
                  font-semibold font-display focus:outline-none focus:shadow-outline hover:bg-primaryAccent
                  shadow-lg transition-css"
            >
              {submitting ? (
                <ReactLoader component={<ThreeDots width="50" />} />
              ) : (
                "Mark As Verified"
              )}
            </button>
          </div>

          {isValidating && !data ? (
            <button
              className="bg-transparent text-primary p-3 w-full tracking-wide
                    font-semibold font-display focus:outline-none focus:shadow-outline hover:bg-primaryAccent
                    shadow-lg transition-css"
            >
              <ReactLoader component={<ThreeDots width="50" />} />
            </button>
          ) : (
            <table className="w-full shadow-lg bg-white text-center">
              <thead>
                <tr>
                  <th className="bg-primary font-semibold border px-8 py-4 text-white">
                    Field Name
                  </th>
                  <th className="bg-primary font-semibold border px-8 py-4 text-white">
                    Data
                  </th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td className="font-semibold border px-8 py-4">Name</td>
                  <td className="font-semibold border px-8 py-4">
                    {data?.name}
                  </td>
                </tr>
                <tr>
                  <td className="font-semibold border px-8 py-4">Email</td>
                  <td className="font-semibold border px-8 py-4">
                    {data?.email}
                  </td>
                </tr>
                <tr>
                  <td className="font-semibold border px-8 py-4">
                    Date Of Birth
                  </td>
                  <td className="font-semibold border px-8 py-4">
                    {data?.dateOfBirth}
                  </td>
                </tr>
                <tr>
                  <td className="font-semibold border px-8 py-4">Mobile No.</td>
                  <td className="font-semibold border px-8 py-4">
                    0{data?.mobileNo}
                  </td>
                </tr>
                <tr>
                  <td className="font-semibold border px-8 py-4">Role</td>
                  <td className="font-semibold border px-8 py-4">
                    {data?.role}
                  </td>
                </tr>
                <tr>
                  <td className="font-semibold border px-8 py-4">Address</td>
                  <td className="font-semibold border px-8 py-4">
                    {data?.address}
                  </td>
                </tr>
                <tr>
                  <td className="font-semibold border px-8 py-4">
                    Borrower Type
                  </td>
                  <td className="font-semibold border px-8 py-4">
                    {data?.borrowerType ? data.borrowerType : "N/A"}
                  </td>
                </tr>
                {photos &&
                  photos.map((photo) => {
                    if (photo[0] === "bankAccountStateMents") {
                      return (
                        <ShowMultipleImage
                          key={new Date().toString()}
                          photo={photo}
                        />
                      );
                    } else {
                      return (
                        <ShowImage
                          key={photo as any}
                          name={photo[0]}
                          url={(photo as any)[1]}
                        />
                      );
                    }
                  })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export const getServerSideProps = withIronSession(
  async (context: NextPageContext) => {
    const user = (context.req as any).session.get("user");
    if (!user) {
      redirectToLogin(context.req, context.res);
      return { props: {} };
    }

    const request: any = context.query.request;
    if (!uuidFormatRegex.test(request)) {
      redirectToErrorPage(context.req, context.res);
    }

    return {
      props: { user, request },
    };
  },
  NEXT_IRON_SESSION_CONFIG
);

export default request;