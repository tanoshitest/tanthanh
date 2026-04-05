import { useParams } from "react-router-dom";
import ClassDetailView from "@/components/shared/ClassDetailView";

const AdminClassDetail = () => {
  const { id } = useParams();
  return <ClassDetailView classId={id!} readonly={true} rolePrefix="/admin" />;
};

export default AdminClassDetail;
