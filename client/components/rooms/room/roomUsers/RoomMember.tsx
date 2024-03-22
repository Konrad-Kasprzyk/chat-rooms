export default function RoomMember(props: { userId: string; username: string; email: string }) {
  return (
    <li className="list-group-item vstack px-0 mb-1">
      <div>{props.username}</div>
      <small>{props.email}</small>
    </li>
  );
}
