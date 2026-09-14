import ShortenerForm from "./ShortenerForm";
import {
  useActionData,
  useLoaderData,
  useNavigation,
  useOutletContext,
} from "react-router";
import { createUrl, getAllUrls } from "./user-api";
import LinkHistory from "./LinkHistory";

export async function loader() {
  try {
    const urls = await getAllUrls();
    return urls;
  } catch (err) {
    return err;
  }
}

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
  const urls = useLoaderData();
  const user = useOutletContext();
  const newUrl = useActionData();
  const navigation = useNavigation();
  return (
    <div className="component-container">
      <ShortenerForm newUrl={newUrl} navigation={navigation} />
      {user || newUrl?._id ? <LinkHistory newUrl={newUrl} urls={urls} /> : null}
    </div>
  );
}
