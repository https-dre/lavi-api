import { axiosApi } from "./axios-api";

type MemberLaundryItem = {
  id: string;
  name: string;
  profile_url: string;
};

export const fetchMemberLaundries = async (
  memberId: string
): Promise<MemberLaundryItem[] | null> => {
  const response = await axiosApi.get(`/members/${memberId}/laundries`);
  if (response.status == 200) {
    const laundries: MemberLaundryItem[] = response.data.laundries;
    return laundries;
  }
  return null;
};
