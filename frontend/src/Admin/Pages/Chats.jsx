import { useEffect, useState, useRef } from "react";
import { useSelector } from 'react-redux';
import { Send, Paperclip, X } from "react-bootstrap-icons";
import "./Chats.css";
import API from '../../api'
import user_icone from '../../assets/user.png'
import logo from '../../assets/Admin_icones/admin-logo.png'
import secureRequest from "../../Compenets/ProtectedRoute/secureRequest";

const Chats = () => {

  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [activeReceiver, setActiveReceiver] = useState();
  const [chatRooms, setChatRooms] = useState();
  const [socket, setSocket] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const { user_id } = useSelector((state) => state.auth);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const VITE_WEBSOCKET_CHAT_URL = import.meta.env.VITE_WEBSOCKET_CHAT_URL;

  const fetchData = async (chatWorkerId = null) => {

    chatWorkerId = chatWorkerId == null ? localStorage.getItem("chatUserId") || 3 : chatWorkerId;
    await secureRequest(async () => {
      API.post(`/chat/get_chats/`, { "user_id": user_id, "workerId": chatWorkerId })
        .then((res) => {
          setChatRooms(res?.data?.chats)
          setActiveReceiver(res?.data?.receiver)
          setMessages(res?.data?.messages)
          const chatRoomId = res?.data?.chat_id
          if (chatRoomId) {
            openChat(chatRoomId);
          } else if (res.data?.chats.length > 0) {
            openChat(res.data.chats[0].id);
          }
        })
        .catch((error) => console.error("Error fetching chats:", error));
    });

  }

  useEffect(() => {
    fetchData();
  }, []);


  const openChat =async (chatRoomId) => {
    localStorage.setItem("chatRoomId", chatRoomId);
    if (socket) socket.close();
    await secureRequest(async () => {
      const newWs = new WebSocket(`${VITE_WEBSOCKET_CHAT_URL}${chatRoomId}/`);
    newWs.onmessage = (event) => {
      const data = JSON.parse(event.data);  
      setMessages((prev) => [...prev, { sender: data.sender, text: data.message, timestamp:data.timestamp, image: data.image || null}]);
    };
    setSocket(newWs);
    })
  };

  const sendMessage = async() => {
    await secureRequest(async () => {
      if (socket && (message.trim() || selectedImage ) ) {
        socket.send(JSON.stringify({ message: message || null, sender: user_id, image: selectedImage || null, }));
        setMessage("");
        setSelectedImage(null);
      }
    })
  };;

  function extractTime(timestampString) {
    const date = new Date(timestampString);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);


  return (
    <div className="ad-content-admin">
      <div className="ad-chat-container">
        <div className="ad-chat-sidebar">
          <div className="ad-sidebar-header">
            <h1 className="ad-sidebar-title">Chats</h1>
          </div>
          <div className="ad-users-list">
            {chatRooms?.map(chatRoom => {
              const opponet = chatRoom?.user2_profile.id == user_id ? chatRoom?.user1_profile : chatRoom?.user2_profile;
              return (
                <div key={chatRoom.id} className={`ad-user-item ${opponet?.id === user_id ? 'active' : ''}`} onClick={() => fetchData(opponet?.id)} >
                  <div className="ad-avatar-container">
                    {opponet.id == 3 ? <img src={logo} alt="Admin user" style={{ borderRadius: "0%" }} className="ad-user-avatar"></img> : opponet?.profile_picture ? <img src={`${opponet?.profile_picture}`} alt={opponet?.name} className="ad-user-avatar" /> : <img src={user_icone} alt={activeReceiver?.first_name} className="ad-current-user-avatar" />}

                    {opponet?.active && <span className="ad-status-indicator"></span>}
                  </div>
                  <div className="ad-user-details">
                    {opponet.id == 3 ? <span className="ad-user-name">You</span> : <span className="ad-user-name">{opponet?.first_name} {opponet?.last_name}</span>}
                    {opponet?.unread > 0 && (
                      <span className="ad-unread-badge">{opponet?.unread}</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>


        <div className="ad-chat-main">
          <div className="ad-chat-header">
            {activeReceiver?.id == 3 ? <img src={logo} alt="you" style={{ borderRadius: "0%" }} className="ad-current-user-avatar"></img> : activeReceiver?.profile_picture ? <img src={`${activeReceiver?.profile_picture}`} alt={activeReceiver?.first_name} className="ad-current-user-avatar" /> : <img src={user_icone} alt={activeReceiver?.first_name} className="ad-current-user-avatar" />}
            <div className="ad-current-user-info">
              {activeReceiver?.id == 3 ? <h5 className="ad-current-user-name">You</h5> : <h5 className="ad-current-user-name">{activeReceiver?.first_name} {activeReceiver?.last_name}</h5>}
            </div>
          </div>

          <div className="ad-messages-container" ref={messagesContainerRef}>
            {messages?.map(msg => (
              <div key={msg.id} className={`ad-message-wrapper ${msg.sender == user_id ? 'ad-user-message' : 'ad-other-message'}`} >
                <div className={`ad-message-bubble ${msg.sender == user_id ? 'ad-user-bubble' : 'ad-other-bubble'}`}>
                  {msg.image && <img src={`${msg.image}`} alt="Sent Image" className="ad-chat-image" />}
                  {msg.text && <p className="ad-message-content">{msg.text}</p>}
                  <span className="ad-message-timestamp">{extractTime(msg.timestamp)}</span>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef}></div>
          </div>

          <div className="ad-message-input-container">
            {selectedImage && (
              <div className="ad-image-preview">
                <button onClick={() => setSelectedImage(null)} className="ad-remove_selected"><X/></button>
                <img src={selectedImage} alt="Preview" className="ad-preview-img" />
              </div>
            )}
            <div className="ad-message-input-wrapper">
              <input type="file" accept="image/*" style={{ display: "none" }} id="fileInput" onChange={(e) => {
                const file = e.target.files[0];
                if (file) { const reader = new FileReader(); reader.onloadend = () => { setSelectedImage(reader.result) }; reader.readAsDataURL(file); }
              }} />
              <label htmlFor="fileInput" className="Paperclip_label">
                <Paperclip className="input-icon" style={{width:"25px",height:"25px"}}/>
              </label>
              <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && sendMessage()} placeholder="Write a message..." className="ad-message-input" />
              <button onClick={sendMessage} className="ad-send-button"><Send className="ad-send-icon"/></button>
            </div>
          </div>
        </div>
      </div>
    </div>

  );
};


export default Chats;
