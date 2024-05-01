import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Table, Modal, Button, Spinner } from "flowbite-react";
import { Link } from "react-router-dom";
import { HiOutlineExclamationCircle } from "react-icons/hi";

const DashUser = () => {
  const { currentUser } = useSelector((state) => state.user);

  const [users, setUsers] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [delId, setDelId] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        const res = await fetch("api/users");

        const data = await res.json();

        if (res.ok) {
          setUsers(data.users);
          setIsLoading(false);
          console.log(data.users);
        } else {
          setIsLoading(false);
          console.log(data.message);
        }
      } catch (err) {
        setIsLoading(false);
        console.log(err);
      }
    };

    if (currentUser.isAdmin) {
      fetchUsers();
    }
  }, [currentUser._id]);

  const handleDelete = async () => {
    setOpenModal(false);
    try {
      const res = await fetch(`api/users/delete//${delId}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (res.ok) {
        setUsers((prev) => prev.filter((user) => user._id !== delId));
        console.log(data.message);
      } else {
        console.log(data.message);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="table-auto overflow-x-auto md:mx-auto p-3 scrollbar">
      {currentUser.isAdmin && users.length > 0 ? (
        <>
          <Table hoverable>
            <Table.Head>
              <Table.HeadCell>Date Created</Table.HeadCell>
              <Table.HeadCell>Profile Picture</Table.HeadCell>
              <Table.HeadCell>Username</Table.HeadCell>
              <Table.HeadCell>Email</Table.HeadCell>
              <Table.HeadCell>Admin</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
            </Table.Head>
            <Table.Body>
              {users.map((user) => (
                <Table.Row key={user._id}>
                  <Table.Cell>
                    {new Date(user.createdAt).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>
                    <img className="h-12 w-12" src={user.profilePicture} />
                  </Table.Cell>
                  <Table.Cell>{user.username}</Table.Cell>
                  <Table.Cell>{user.email}</Table.Cell>
                  <Table.Cell>
                    {user.isAdmin ? (
                      <p className="font-semibold text-green-500">Yes</p>
                    ) : (
                      <p className="font-semibold text-red-500">No</p>
                    )}
                  </Table.Cell>
                  <Table.Cell>
                    <span
                      onClick={() => {
                        setOpenModal(true);
                        setDelId(user._id);
                      }}
                      className="text-red-500  hover:underline cursor-pointer"
                    >
                      Delete
                    </span>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </>
      ) : (
        <>
          {isLoading && <Spinner color="warning" size="xl" />}

          {!isLoading && users.length === 0 && <h2>No Users</h2>}
        </>
      )}

      <Modal
        show={openModal}
        size="md"
        onClose={() => setOpenModal(false)}
        popup
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Are you sure you want to delete this product?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDelete}>
                Yes, I'm sure
              </Button>
              <Button color="gray" onClick={() => setOpenModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default DashUser;
