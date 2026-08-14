import api from "./axios";

export interface Position {
  id: number;
  position_name: string;
}

export interface GetPositionsResponse {
  success: boolean;
  data: Position[];
}

export const getPositions = async (): Promise<GetPositionsResponse> => {
  const response = await api.get<GetPositionsResponse>("/positions");

  return response.data;
};