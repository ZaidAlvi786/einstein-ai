"use client";
import { Card } from "@nextui-org/react";
import React from "react";

const ToglBox = () => {
  return (
    <Card
      //  isPressable
      //   isHoverable
      style={{
        margin: "auto",
        background: "white",
        color: "black",
        padding: "10px",
        width: "237px",
        height: "86px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: "50.17px",
        borderRadius: "10px",
        flexDirection: "row",
        marginBottom: "20px",
      }}
    >
      <div
        style={{
          width: "55px",
          height: "35px",
          background: "white",
          border: "2px solid black",
          borderRadius: "50px",
          padding:'5px',
          display:'flex',
          justifyContent:'end',
          alignItems:'center',
          marginTop:'5px',
          marginRight:'5px'
        }}
      >
        <div style={{width:"25px", height:'25px', borderRadius:'50%', background:'black'}}></div>
      </div>
      <h2 className="font-nasalization font-normal">Togl</h2>
    </Card>
  );
};

export default ToglBox;
