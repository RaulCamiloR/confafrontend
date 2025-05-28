import Reports from "./components/Reports";
import axios from "axios";

type TokenResponse = {
  accessToken: string;
  refreshToken: string;
  idToken: string;
};

const fetchToken = async (): Promise<TokenResponse> => {
  const response = await axios.post(
    "https://wdba5ur6id.execute-api.us-east-1.amazonaws.com/prod/login",
    {
      username: "msantoro",
      password: "CognitoConfa1*",
    },
  );
  const { accessToken, refreshToken, idToken } = response.data.body;

  return { accessToken, refreshToken, idToken };
};

const Reportes = async () => {
  const { accessToken, refreshToken, idToken } = await fetchToken();

  return (
    <div>
      <Reports
        accessToken={accessToken}
        refreshToken={refreshToken}
        idToken={idToken}
      />
    </div>
  );
};

export default Reportes;

