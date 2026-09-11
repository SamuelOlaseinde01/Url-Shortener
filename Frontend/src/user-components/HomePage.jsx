import ShortenerForm from "./ShortenerForm";
import { useActionData, useNavigation } from "react-router";
import { createUrl } from "./user-api";

export async function action({ request }) {
  try {
    const formData = await request.formData();
    const originalUrl = formData.get("originalUrl");
    const newUrl = await createUrl({ originalUrl });
    return newUrl;
  } catch (error) {
    return error;
  }
}

export default function HomePage() {
  const newUrl = useActionData();
  const navigation = useNavigation();
  return (
    <div className="component-container">
      <ShortenerForm newUrl={newUrl} navigation={navigation} />
    </div>
  );
}
