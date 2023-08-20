import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

export default function App() {
  const [open, setOpen] = useState(false);
  const [friend, setFriend] = useState(initialFriends);
  const [selectFriend, setSelectedFriend] = useState(null);

  function handleAddFriend(friend) {
    setFriend((e) => [...e, friend]);
    setOpen(false);
  }

  function handleopen() {
    setOpen((open) => !open);
  }

  function handleSelection(friend) {
    setSelectedFriend(friend);
    setOpen(false);
  }

  function handleSplitBill(value){
   setFriend((friends)=>friends.map((friend)=>friend.id === selectFriend.id ? {...friend,balance : friend.balance+value }:friend))
   setSelectedFriend(null);
  }

  return (
    <div
      className="app"
      style={{
        "min-height": "66vh",
        display: "grid",
        "grid-template-columns": "34rem 44rem",
        "column-gap": "4rem",
        "align-items": "start",
      }}
    >
      <div className="sidebar">
        <FriendList
          friends={friend}
          onSelection={handleSelection}
          selectFriend={selectFriend}
        />

        {open ? <AddFriendForm handleAddFriend={handleAddFriend} /> : null}

        <Button onclick={handleopen}>{open ? "Close" : "Add Friend"}</Button>
      </div>
      <div>{selectFriend && <SplitBillForm selectFriend={selectFriend} handleSplitBill={handleSplitBill} key={selectFriend.id} />}</div>
    </div>
  );
}

function FriendList({ friends, onSelection, selectFriend }) {
  return (
    <ul>
      {friends.map((friends) => (
        <Friend
          friend={friends}
          key={friends.id}
          onSelection={onSelection}
          selectFriend={selectFriend}
        />
      ))}
    </ul>
  );
}

function Friend({ friend, onSelection, selectFriend }) {
  const isSelected = selectFriend?.id === friend.id;
  return (
    <li className={isSelected?"selected":""}>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>
      {friend.balance < 0 && (
        <p className="red">
          You owe {friend.name} ${Math.abs(friend.balance)}
        </p>
      )}
      {friend.balance > 0 && (
        <p className="green">
          {friend.name} owes you ${Math.abs(friend.balance)}.
        </p>
      )}
      {friend.balance === 0 && <p>You and {friend.name} are even.</p>}

      {isSelected ? (
        <Button onclick={() => onSelection()}>Close</Button>
      ) : (
        <Button onclick={() => onSelection(friend)}>Select</Button>
      )}
    </li>
  );
}

function Button({ children, onclick }) {
  return (
    <button className="button" onClick={onclick}>
      {children}
    </button>
  );
}

function AddFriendForm({ handleAddFriend }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48");
  function handleClick(e) {
    e.preventDefault();
    if (!name || !image) return;
    const id = crypto.randomUUID();
    const newFriend = { id, name, image: `${image}?=${id}`, balance: 0 };

    handleAddFriend(newFriend);
    // console.log(newItem);

    setName("");
    setImage("https://i.pravatar.cc/48");
  }
  return (
    <form className="form-add-friend">
      <label>🙋‍♂️Friend Name</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <label>🖼️Image URL</label>
      <input
        type="text"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      />
      <Button onclick={handleClick}>ADD</Button>
    </form>
  );
}


function SplitBillForm({ selectFriend ,handleSplitBill}) {
  const [bill,setBill]=useState('');
  const [paidByUser,setPaidByUser]=useState('');
  const paidByFriend =bill? bill-paidByUser:"" ;
  const[whoIsPaying,setWhiIsPaying] = useState("user")

  function handleSubmit(e){
    e.preventDefault();
    if(!bill || !paidByUser) return;
    handleSplitBill(whoIsPaying === 'user'?paidByFriend:-paidByUser);
  }
  return (
    <form className="form-split-bill" onSubmit={handleSubmit}>
      <h2>Split a bill with {selectFriend.name}</h2>
      <label>💵 Bill Value</label>
      <input
        type="number"
        value={bill}
        onChange={(e) => setBill(Number(e.target.value))}
      />
      <label>👦Your Expense</label>
      <input
        type="number"
        value={paidByUser}
        onChange={(e) =>
          setPaidByUser(
            Number(e.target.value) > bill ? "" : Number(e.target.value)
          )
        }
      />
      <label>🙋‍♂️ {selectFriend.name}'s Expense</label>
      <input type="number" disabled value={paidByFriend} />
      <label>🤑Who is paying the money</label>
      <select
        value={whoIsPaying}
        onChange={(e) => setWhiIsPaying(e.target.value)}
      >
        <option value="user">You</option>
        <option value="friend">{selectFriend.name}</option>
      </select>
      <Button>Split Bill</Button>
    </form>
  );
}
