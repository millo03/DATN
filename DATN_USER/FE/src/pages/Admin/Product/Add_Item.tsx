import { CheckAuths } from "../../../common/hooks/Auth/useAuthorization";
import Form_Item from "./_component/form";

const Add_Item = () => {
  return (
    <CheckAuths roles={["admin"]}>
      <Form_Item />
    </CheckAuths>
  );
};

export default Add_Item;
