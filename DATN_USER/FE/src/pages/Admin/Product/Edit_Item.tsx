import { CheckAuths } from "../../../common/hooks/Auth/useAuthorization";
import Form_Item from "./_component/form";

const Edit_Item = () => {
  return (
    <CheckAuths roles={["admin"]}>
      {" "}
      <Form_Item mode={"edit"} />
    </CheckAuths>
  );
};

export default Edit_Item;
