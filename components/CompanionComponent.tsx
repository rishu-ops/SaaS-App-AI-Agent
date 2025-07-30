"use client";

import { cn, configureAssistant, getSubjectColor } from "@/lib/utils";
import { vapi } from "@/lib/vapi.sdk";
import Lottie, { LottieRefCurrentProps } from "lottie-react";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import soundwaves from "@/constants/soundwaves.json";

enum Callstatus {
  INACTIVE = "inactive",
  ACTIVE = "active",
  CONECTING = "connecting",
  FINISHED = "finished",
}

const CompanionComponent = ({
  companionId,
  subject,
  topic,
  name,
  userName,
  userImage,
  voice,
  style,
}: CompanionComponentProps) => {
  const [callStatus, setCallStatus] = useState<Callstatus>(Callstatus.INACTIVE);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [messages, setMessages] = useState<SavedMessage[]>([]);

  const lottieRef = useRef<LottieRefCurrentProps>(null);

  useEffect(() => {
    if (lottieRef) {
      if (isSpeaking) lottieRef.current?.play();
      else lottieRef.current?.stop();
    }
  }, [isSpeaking, lottieRef]);

  useEffect(() => {
    const onCallStart = () => setCallStatus(Callstatus.ACTIVE);

    const onCallEnd = () => setCallStatus(Callstatus.FINISHED);

    const onMessage = (message: Message) => {
      if (message.type === "transcript" && message.transcriptType === "final") {
        const newMessage = { role: message.role, content: message.transcript };
        setMessages((prev) => [newMessage, ...prev]);
      }
    };

    const onSpeechStart = () => setIsSpeaking(true);

    const onSpeechEnd = () => setIsSpeaking(false);

    const onError = (error: Error) =>
      console.error("Error in companion component:", error);

    // vapi event listeners
    vapi.on("call-start", onCallStart);
    vapi.on("call-end", onCallEnd);
    vapi.on("message", onMessage);
    vapi.on("error", onError);
    vapi.on("speech-start", onSpeechStart);
    vapi.on("speech-end", onSpeechEnd);

    return () => {
      vapi.off("call-start", onCallStart);
      vapi.off("call-end", onCallEnd);
      vapi.off("message", onMessage);
      vapi.off("error", onError);
      vapi.off("speech-start", onSpeechStart);
      vapi.off("speech-end", onSpeechEnd);
    };
  }, []);

  const toggleMicrophone = () => {
    const isMuted = vapi.isMuted();
    vapi.setMuted(!isMuted);
    setIsMuted(!isMuted);
  };

  const handleCall = async () => {
    setCallStatus(Callstatus.CONECTING);

    const assistantOverrides = {
      variableValues: { subject, topic, style },
      clientMessages: ["transcript"],
      serverMessages: [],
    };

    //   @ts-expect-error
    vapi.start(configureAssistant(voice, style), assistantOverrides);
  };

  const handleDisconnect = async () => {
    setCallStatus(Callstatus.FINISHED);
    vapi.stop();
  };

  return (
    <div className="flex flex-col h-[100vh]">
      <section className="flex gap-8 max-sm:flex-col">
        <div className="companion-section">
          <div
            className="companion-avatar"
            style={{ backgroundColor: getSubjectColor(subject) }}
          >
            <div
              className={cn(
                "absolute transition-opacity duraion-1000",
                callStatus === Callstatus.FINISHED ||
                  callStatus === Callstatus.INACTIVE
                  ? "opacity-100"
                  : "opacity-0",
                callStatus === Callstatus.ACTIVE && "opacity-100 animate-pulse"
              )}
            >
              <Image
                src={`/icons/${subject}.svg`}
                alt={`${subject}.svg`}
                width={150}
                height={150}
                className="max-sm:w-fit"
              />
            </div>

            <div
              className={cn(
                "absolute transition-opacity duraion-1000",
                callStatus === Callstatus.ACTIVE ? "opacity-100" : "opacity-0"
              )}
            >
              <Lottie
                lottieRef={lottieRef}
                animationData={soundwaves}
                autoplay={false}
                className="companion-lottie"
              />
            </div>
          </div>
          <p className="font-bold text-2xl">{name}</p>
        </div>

        <div className="user-section">
          <div className="user-avatar">
            <Image
              src={userImage}
              alt={userName}
              width={130}
              height={130}
              className="rounded-lg"
            />

            <p className="font-bold text-2xl">{userName}</p>
          </div>

          <button
            className="btn-mic"
            disabled={callStatus === Callstatus.ACTIVE}
            onClick={toggleMicrophone}
          >
            <Image
              src={isMuted ? "/icons/mic-off.svg" : "/icons/mic-on.svg"}
              alt="mic"
              width={36}
              height={36}
            />

            <p className="max-sm:hidden">
              {isMuted ? "Turn on mic" : "Turn off mic"}
            </p>
          </button>

          <button
            className={cn(
              "rounded-lg py-2 cursor-pointer transition-colors w-full text-white",
              callStatus === Callstatus.ACTIVE ? "bg-red-700" : "bg-primary",
              callStatus === Callstatus.CONECTING ? "animate-pulse" : ""
            )}
            onClick={
              callStatus === Callstatus.ACTIVE ? handleDisconnect : handleCall
            }
          >
            {callStatus === Callstatus.ACTIVE
              ? "End Session"
              : callStatus === Callstatus.CONECTING
              ? "Connecting..."
              : "Start Session"}
          </button>
        </div>
      </section>

      {/* transscript */}
      <section className="transcript">
        <div className="transcript-message no-scrollbar">
          {messages.map((message, index) => {
            if (message.role === "assistant") {
              return (
                <p key={index} className="max-sm:text-sm">
                  {name.split(" ")[0].replace("/[.,]/g", "")} :{" "}
                  {message.content}
                </p>
              );
            } else {
              return (
                <p key={index} className="text-primary max-sm:text-sm">
                  {userName} : {message.content}
                </p>
              );
            }
          })}
        </div>

        <div className="transcript-fade" />
      </section>
    </div>
  );
};

export default CompanionComponent;
