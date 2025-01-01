"use client"

import { useState } from "react";
import { useModelStatus } from "../context/ModelStatusContext";
import Image from "next/image";
import { Carousel } from "antd";
import { Button } from "@nextui-org/react";
import { Tabs, Tab } from "@nextui-org/react";
import { Switch, cn } from "@nextui-org/react";

const Model_Interface = () => {
  const { textStatus, setTextStatus } = useModelStatus();
  const { imgStatus, setImgStatus } = useModelStatus();
  const [selected, setSelected] = useState("text");

  return (
    <div className="flex flex-1 flex-col overflow-auto">
      <div className="flex flex-1 flex-col max-w-[930px] max-mxl:max-w-[700px] max-msm:max-w-[360px] w-full pt-[56px] mx-auto">
        <div className="flex flex-col bg-[#23272B] rounded-2xl">
          <div className="flex flex-row gap-3 items-center">
            <Image
              alt="logo"
              width={34}
              height={34}
              src={"/logo.png"}
              className="ml-7 mt-7"
            />
            <p className="text-[#FFF] text-base font-normal leading-normal font-nasalization mt-7">
              Einstein Models
            </p>
          </div>
          <Carousel autoplay autoplaySpeed={8000}>
            <div>
              <div className="mt-6 ml-[52px] text-[#FFF] text-[32px] max-msm:text-[22px] max-msm:ml-8 font-semibold leading-normal">
                The best AI At Your Fingertips
              </div>
              <div className="mt-4 ml-[52px] text-[#FFF] text-[20px] max-msm:ml-8 font-medium leading-normal">
                Enable different models for your fabric ai to access. Add up to
                4 models
              </div>
              <div className="mt-[54px] max-mxl:mt-[20px] ml-11 max-msm:ml-8">
                <Button radius="full" color="primary" className="bg-[#0a84ff]">
                  Learn More
                  <Image alt="export icon" width={16} height={16} src={"svg/export.svg"} />
                </Button>
              </div>
            </div>
            <div>
              <div className="mt-6 ml-[52px] text-[#FFF] text-[32px] font-semibold leading-normal">
                Turn models on and off anytime
              </div>
              <div className="mt-4 ml-[52px] text-[#FFF] text-[20px] font-medium leading-normal">
                Toggle AI models on/off as needed—flexible, adaptive, and
                user-friendly.
              </div>
              <div className="mt-[54px] ml-11 mb-[58px]">
                <Button radius="full" color="primary" className="bg-[#0a84ff]">
                  Learn More{" "}
                  <Image alt="export icon" width={16} height={16} src={"svg/export.svg"} />
                </Button>
              </div>
            </div>
            <div>
              <div className="mt-6 ml-[52px] text-[#FFF] text-[32px] font-semibold leading-normal">
                Access open source models with no limits
              </div>
              <div className="mt-4 ml-[52px] text-[#FFF] text-[20px] font-medium leading-normal">
                Gain unrestricted access to a diverse range of open-source AI
                models.
              </div>
              <div className="mt-[54px] ml-11 mb-[58px]">
                <Button radius="full" color="primary" className="bg-[#0a84ff]">
                  Learn More{" "}
                  <Image alt="export icon" width={16} height={16} src={"svg/export.svg"} />
                </Button>
              </div>
            </div>
            <div>
              <div className="mt-6 ml-[52px] text-[#FFF] text-[32px] font-semibold leading-normal">
                One conversation, many models
              </div>
              <div className="mt-4 ml-[52px] text-[#FFF] text-[20px] font-medium leading-normal">
                Enable different models for EinStein to access. Add up to 4
                models
              </div>
              <div className="mt-[54px] ml-11 mb-[58px]">
                <Button radius="full" color="primary" className="bg-[#0a84ff]">
                  Learn More{" "}
                  <Image alt="export icon" width={16} height={16} src={"svg/export.svg"} />
                </Button>
              </div>
            </div>
          </Carousel>
        </div>
        <div className="flex flex-wrap gap-0 mt-11">
          <Tabs
            size="sm"
            radius="full"
            aria-label="Tabs form"
            selectedKey={selected}
            onSelectionChange={setSelected}
            className=" font-nasalization text-[#FFF] text-sm py-0"
            classNames={{
              tabContent: "text-[#C2C2C2] px-2",
              cursor: "bg-[#3B3B3D]",
              tabList: "bg-[#29292B] p-0",
              tabContent: "group-data-[selected=true]:text-[#FFF]",
            }}
          >
            <Tab key="text" title="Text">
              <div className="grid grid-cols-3 max-mxl:grid-cols-2 max-msm:grid-cols-1 gap-6 mt-4 w-full">
                <div className="flex flex-col gap-4 rounded-2xl bg-[#23272B] p-6">
                  <div className="flex flex-row">
                    <Image
                      alt="gpt3 icon"
                      width={48}
                      height={48}
                      src={"/models/gpt3.png"}
                    />
                    <div className="ml-3 mr-[70px] mt-2 text-[#FFF] text-2xl msm:hidden max-msm:text-xl font-inter font-medium leading-normal">
                      Chat GPT 3.5
                    </div>
                    <Switch
                      isSelected={textStatus[0]}
                      onValueChange={(value) => {
                        let a = [...textStatus];
                        a[0] = value;
                        setTextStatus(a);
                      }}
                      classNames={{
                        base: cn(
                          "inline-flex flex-row-reverse w-full max-msm:max-w-max max-msm:mt-3 max-w-md items-start",
                          "justify-between cursor-pointer rounded-lg",
                          "data-[selected=true]:border-primary"
                        ),
                        wrapper: "p-0 h-4 overflow-visible",
                        thumb: cn(
                          "w-6 h-6 border-2 shadow-lg",
                          "group-data-[hover=true]:border-primary",
                          "group-data-[selected=true]:ml-6",
                          "group-data-[selected]:group-data-[pressed]:ml-4"
                        ),
                      }}
                    ></Switch>
                  </div>
                  <div className="max-msm:hidden text-[#FFF] text-2xl font-inter font-medium leading-normal">
                    Chat GPT 3.5
                  </div>
                  <div className="flex flex-col max-msm:hidden">
                    <div className="text-[#FFF] text-base font-inter font-normal leading-normal">
                      Advanced conversational AI, versatile across multiple
                      tasks, excellent at understanding and generating
                      human-like text.
                    </div>
                    <div className="flex flex-row justify-end mt-7 text-[#0A84FF] text-sm font-bold leading-normal">
                      Lean more
                    </div>
                  </div>
                  <div className="flex flex-col w-full msm:hidden">
                    <div className="flex flex-col gap-2 text-base text-[#FFF] font-normal leading-normal">
                      <p>+ Conversation, Writing</p>
                      <p>- Research, Highly Censored</p>
                      <p className="mt-3 text-sm font-helvetica text-[#0A84FF] font-bold flex flex-row justify-center">
                        Lean more
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-4 rounded-2xl bg-[#23272B] p-6">
                  <div className="flex flex-row">
                    <Image
                      alt="gpt 4 icon"
                      width={48}
                      height={48}
                      src={"/models/gpt4.png"}
                    />
                    <div className="ml-3 mr-[80px] mt-2 text-[#FFF] text-2xl msm:hidden max-msm:text-xl font-inter font-medium leading-normal">
                      Chat GPT 4
                    </div>
                    <Switch
                      isSelected={textStatus[1]}
                      onValueChange={(value) => {
                        let a = [...textStatus];
                        a[1] = value;
                        setTextStatus(a);
                      }}
                      classNames={{
                        base: cn(
                          "inline-flex flex-row-reverse w-full max-msm:max-w-max max-msm:mt-3 max-w-md items-start",
                          "justify-between cursor-pointer rounded-lg",
                          "data-[selected=true]:border-primary"
                        ),
                        wrapper: "p-0 h-4 overflow-visible",
                        thumb: cn(
                          "w-6 h-6 border-2 shadow-lg",
                          "group-data-[hover=true]:border-primary",
                          "group-data-[selected=true]:ml-6",
                          "group-data-[selected]:group-data-[pressed]:ml-4"
                        ),
                      }}
                    ></Switch>
                  </div>
                  <div className="max-msm:hidden text-[#FFF] text-2xl font-inter font-medium leading-normal">
                    Chat GPT 4
                  </div>
                  <div className="flex flex-col max-msm:hidden">
                    <div className="text-[#FFF] text-base font-inter font-normal leading-normal">
                      More sophisticated than 3.5 with improved contextual
                      understanding and nuanced text generation capabilities.
                    </div>
                    <div className="flex flex-row justify-end mt-7 text-[#0A84FF] text-sm font-bold leading-normal">
                      Lean more
                    </div>
                  </div>
                  <div className="flex flex-col w-full msm:hidden">
                    <div className="flex flex-col gap-2 text-base text-[#FFF] font-normal leading-normal">
                      <p>+ Industry Standard Model, Writing</p>
                      <p>- Highly Censored</p>
                      <p className="mt-3 text-sm font-helvetica text-[#0A84FF] font-bold flex flex-row justify-center">
                        Lean more
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-4 rounded-2xl bg-[#23272B] p-6">
                  <div className="flex flex-row">
                    <Image
                      alt="gemini icon"
                      width={48}
                      height={48}
                      src={"/models/gemini.png"}
                    />
                    <div className="ml-3 mr-[30px] mt-2 text-[#FFF] text-2xl msm:hidden max-msm:text-xl font-inter font-medium leading-normal">
                      Gemini-Pro Beta
                    </div>
                    <Switch
                      isSelected={textStatus[2]}
                      onValueChange={(value) => {
                        let a = [...textStatus];
                        a[2] = value;
                        setTextStatus(a);
                      }}
                      classNames={{
                        base: cn(
                          "inline-flex flex-row-reverse w-full max-msm:max-w-max max-msm:mt-3 max-w-md items-start",
                          "justify-between cursor-pointer rounded-lg",
                          "data-[selected=true]:border-primary"
                        ),
                        wrapper: "p-0 h-4 overflow-visible",
                        thumb: cn(
                          "w-6 h-6 border-2 shadow-lg",
                          "group-data-[hover=true]:border-primary",
                          "group-data-[selected=true]:ml-6",
                          "group-data-[selected]:group-data-[pressed]:ml-4"
                        ),
                      }}
                    ></Switch>
                  </div>
                  <div className="max-msm:hidden text-[#FFF] text-2xl font-inter font-medium leading-normal">
                    Gemini-Pro Beta
                  </div>
                  <div className="flex flex-col max-msm:hidden">
                    <div className="text-[#FFF] text-base font-inter font-normal leading-normal">
                      State-of-the-art model featuring high adaptability and
                      innovative features, still in beta testing.
                    </div>
                    <div className="flex flex-row justify-end mt-7 text-[#0A84FF] text-sm font-bold leading-normal">
                      Lean more
                    </div>
                  </div>
                  <div className="flex flex-col w-full msm:hidden">
                    <div className="flex flex-col gap-2 text-base text-[#FFF] font-normal leading-normal">
                      <p>+ Open, Re-drafting</p>
                      <p>- Hallucinations, Understanding</p>
                      <p className="mt-3 text-sm font-helvetica text-[#0A84FF] font-bold flex flex-row justify-center">
                        Lean more
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-4 rounded-2xl bg-[#23272B] p-6">
                  <div className="flex flex-row">
                    <Image
                      alt="perplexity icon"
                      width={48}
                      height={48}
                      src={"/models/perplexity.png"}
                    />
                    <div className="ml-3 mr-[90px] mt-2 text-[#FFF] text-2xl msm:hidden max-msm:text-xl font-inter font-medium leading-normal">
                      Perplexity
                    </div>
                    <Switch
                      isSelected={textStatus[3]}
                      onValueChange={(value) => {
                        let a = [...textStatus];
                        a[3] = value;
                        setTextStatus(a);
                      }}
                      classNames={{
                        base: cn(
                          "inline-flex flex-row-reverse w-full max-msm:max-w-max max-msm:mt-3 max-w-md items-start",
                          "justify-between cursor-pointer rounded-lg",
                          "data-[selected=true]:border-primary"
                        ),
                        wrapper: "p-0 h-4 overflow-visible",
                        thumb: cn(
                          "w-6 h-6 border-2 shadow-lg",
                          "group-data-[hover=true]:border-primary",
                          "group-data-[selected=true]:ml-6",
                          "group-data-[selected]:group-data-[pressed]:ml-4"
                        ),
                      }}
                    ></Switch>
                  </div>
                  <div className="max-msm:hidden text-[#FFF] text-2xl font-inter font-medium leading-normal">
                    Perplexity
                  </div>
                  <div className="flex flex-col max-msm:hidden">
                    <div className="text-[#FFF] text-base font-inter font-normal leading-normal">
                      An online model by Perplexity Labs, with real-time
                      internet data for current, accurate responses. Ideal for
                      latest news and scores.
                    </div>
                    <div className="flex flex-row justify-end mt-7 text-[#0A84FF] text-sm font-bold leading-normal">
                      Lean more
                    </div>
                  </div>
                  <div className="flex flex-col w-full msm:hidden">
                    <div className="flex flex-col gap-2 text-base text-[#FFF] font-normal leading-normal">
                      <p>+ Internet Research</p>
                      <p>- Re-drafting</p>
                      <p className="mt-3 text-sm font-helvetica text-[#0A84FF] font-bold flex flex-row justify-center">
                        Lean more
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-4 rounded-2xl bg-[#23272B] p-6">
                  <div className="flex flex-row">
                    <Image
                      alt="mistral icon"
                      width={48}
                      height={48}
                      src={"/models/mistral.png"}
                    />
                    <div className="ml-3 mr-[40px] mt-2 text-[#FFF] text-2xl msm:hidden max-msm:text-xl font-inter font-medium leading-normal">
                      Mistral Medium
                    </div>
                    <Switch
                      isSelected={textStatus[4]}
                      onValueChange={(value) => {
                        let a = [...textStatus];
                        a[4] = value;
                        setTextStatus(a);
                      }}
                      classNames={{
                        base: cn(
                          "inline-flex flex-row-reverse w-full max-msm:max-w-max max-msm:mt-3 max-w-md items-start",
                          "justify-between cursor-pointer rounded-lg",
                          "data-[selected=true]:border-primary"
                        ),
                        wrapper: "p-0 h-4 overflow-visible",
                        thumb: cn(
                          "w-6 h-6 border-2 shadow-lg",
                          "group-data-[hover=true]:border-primary",
                          "group-data-[selected=true]:ml-6",
                          "group-data-[selected]:group-data-[pressed]:ml-4"
                        ),
                      }}
                    ></Switch>
                  </div>
                  <div className="max-msm:hidden text-[#FFF] text-2xl font-inter font-medium leading-normal">
                    Mistral Medium
                  </div>
                  <div className="flex flex-col max-msm:hidden">
                    <div className="text-[#FFF] text-base font-inter font-normal leading-normal">
                      A top-tier multi-language model by Mistral AI. Excellent
                      in code, languages like English, French, and scores 8.6 on
                      MT-Bench.
                    </div>
                    <div className="flex flex-row justify-end mt-7 text-[#0A84FF] text-sm font-bold leading-normal">
                      Lean more
                    </div>
                  </div>
                  <div className="flex flex-col w-full msm:hidden">
                    <div className="flex flex-col gap-2 text-base text-[#FFF] font-normal leading-normal">
                      <p>+ Speed, Cost, Code</p>
                      <p>- Accuracy, Input Length</p>
                      <p className="mt-3 text-sm font-helvetica text-[#0A84FF] font-bold flex flex-row justify-center">
                        Lean more
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-4 rounded-2xl bg-[#23272B] p-6">
                  <div className="flex flex-row">
                    <Image
                      alt="claude icon"
                      width={48}
                      height={48}
                      src={"/models/claude.png"} // Replace with the image source for Claude
                    />
                    <div className="ml-3 mr-[40px] mt-2 text-[#FFF] text-2xl msm:hidden max-msm:text-xl font-inter font-medium leading-normal">
                      Claude
                    </div>
                    <Switch
                      isSelected={textStatus[5]}
                      onValueChange={(value) => {
                        let a = [...textStatus];
                        a[5] = value;
                        setTextStatus(a);
                      }}
                      classNames={{
                        base: cn(
                          "inline-flex flex-row-reverse w-full max-msm:max-w-max max-msm:mt-3 max-w-md items-start",
                          "justify-between cursor-pointer rounded-lg",
                          "data-[selected=true]:border-primary"
                        ),
                        wrapper: "p-0 h-4 overflow-visible",
                        thumb: cn(
                          "w-6 h-6 border-2 shadow-lg",
                          "group-data-[hover=true]:border-primary",
                          "group-data-[selected=true]:ml-6",
                          "group-data-[selected]:group-data-[pressed]:ml-4"
                        ),
                      }}
                    ></Switch>
                  </div>
                  <div className="max-msm:hidden text-[#FFF] text-2xl font-inter font-medium leading-normal">
                    Claude
                  </div>
                  <div className="flex flex-col max-msm:hidden">
                    <div className="text-[#FFF] text-base font-inter font-normal leading-normal">
                      Claude is a next generation AI assistant built for work
                      and trained to be safe, accurate, and secure.
                    </div>
                    <div className="flex flex-row justify-end mt-7 text-[#0A84FF] text-sm font-bold leading-normal">
                      Learn more
                    </div>
                  </div>
                  <div className="flex flex-col w-full msm:hidden">
                    <div className="flex flex-col gap-2 text-base text-[#FFF] font-normal leading-normal">
                      <p>+ Speed, Cost, Code</p>
                      <p>- Accuracy, Input Length</p>
                      <p className="mt-3 text-sm font-helvetica text-[#0A84FF] font-bold flex flex-row justify-center">
                        Learn more
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Tab>
            <Tab key="image" title="Image">
              <div className="grid grid-cols-3 max-mxl:grid-cols-2 max-msm:grid-cols-1 gap-6 mt-4 w-full">
                <div className="flex flex-col gap-4 rounded-2xl bg-[#23272B] p-6">
                  <div className="flex flex-row">
                    <Image
                      alt="dall-e icon"
                      width={48}
                      height={48}
                      src={"/models/dall-e.png"}
                    />
                    <div className="ml-3 mr-[115px] mt-2 text-[#FFF] text-2xl msm:hidden max-msm:text-xl font-inter font-medium leading-normal">
                      DALL -E
                    </div>
                    <Switch
                      isSelected={imgStatus[0]}
                      onValueChange={(value) => {
                        let a = [...imgStatus];
                        a[0] = value;
                        setImgStatus(a);
                      }}
                      classNames={{
                        base: cn(
                          "inline-flex flex-row-reverse w-full max-msm:max-w-max max-msm:mt-3 max-w-md items-start",
                          "justify-between cursor-pointer rounded-lg",
                          "data-[selected=true]:border-primary"
                        ),
                        wrapper: "p-0 h-4 overflow-visible",
                        thumb: cn(
                          "w-6 h-6 border-2 shadow-lg",
                          "group-data-[hover=true]:border-primary",
                          "group-data-[selected=true]:ml-6",
                          "group-data-[selected]:group-data-[pressed]:ml-4"
                        ),
                      }}
                    ></Switch>
                  </div>
                  <div className="max-msm:hidden text-[#FFF] text-2xl font-inter font-medium leading-normal">
                    DALL -E
                  </div>
                  <div className="flex flex-col max-msm:hidden">
                    <div className="text-[#FFF] text-base font-inter font-normal leading-normal">
                      Specializes in creating unique, imaginative images from
                      text descriptions, showcasing creative and artistic
                      abilities.
                    </div>
                    <div className="flex flex-row justify-end mt-7 text-[#0A84FF] text-sm font-bold leading-normal">
                      Lean more
                    </div>
                  </div>
                  <div className="flex flex-col w-full msm:hidden">
                    <div className="flex flex-col gap-2 text-base text-[#FFF] font-normal leading-normal">
                      <p>+ Industry Leader, imaginative images</p>
                      <p>- Accuracy, Input Length</p>
                      <p className="mt-3 text-sm font-helvetica text-[#0A84FF] font-bold flex flex-row justify-center">
                        Lean more
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-4 rounded-2xl bg-[#23272B] p-6">
                  <div className="flex flex-row">
                    <Image
                      alt="s-xl icon"
                      width={48}
                      height={48}
                      src={"/models/s-xl.png"}
                    />
                    <div className="ml-3 mr-[15px] mt-2 text-[#FFF] text-2xl msm:hidden max-msm:text-xl font-inter font-medium leading-normal">
                      Stable Diffusion XL
                    </div>
                    <Switch
                      isSelected={imgStatus[1]}
                      onValueChange={(value) => {
                        let a = [...imgStatus];
                        a[1] = value;
                        setImgStatus(a);
                      }}
                      classNames={{
                        base: cn(
                          "inline-flex flex-row-reverse w-full max-msm:max-w-max max-msm:mt-3 max-w-md items-start",
                          "justify-between cursor-pointer rounded-lg",
                          "data-[selected=true]:border-primary"
                        ),
                        wrapper: "p-0 h-4 overflow-visible",
                        thumb: cn(
                          "w-6 h-6 border-2 shadow-lg",
                          "group-data-[hover=true]:border-primary",
                          "group-data-[selected=true]:ml-6",
                          "group-data-[selected]:group-data-[pressed]:ml-4"
                        ),
                      }}
                    ></Switch>
                  </div>
                  <div className="max-msm:hidden text-[#FFF] text-2xl font-inter font-medium leading-normal">
                    Stable Diffusion XL
                  </div>
                  <div className="flex flex-col max-msm:hidden">
                    <div className="text-[#FFF] text-base font-inter font-normal leading-normal">
                      An advanced iteration known for its capability to handle
                      complex image generation tasks with high accuracy.
                    </div>
                    <div className="flex flex-row justify-end mt-7 text-[#0A84FF] text-sm font-bold leading-normal">
                      Lean more
                    </div>
                  </div>
                  <div className="flex flex-col w-full msm:hidden">
                    <div className="flex flex-col gap-2 text-base text-[#FFF] font-normal leading-normal">
                      <p>+ Inexpensive, Fast</p>
                      <p>- Accuracy</p>
                      <p className="mt-3 text-sm font-helvetica text-[#0A84FF] font-bold flex flex-row justify-center">
                        Lean more
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-4 rounded-2xl bg-[#23272B] p-6">
                  <div className="flex flex-row">
                    <Image
                      alt="s-diffu icon"
                      width={48}
                      height={48}
                      src={"/models/s-diffu.png"}
                    />
                    <div className="ml-3 mr-[25px] mt-2 text-[#FFF] text-2xl msm:hidden max-msm:text-xl font-inter font-medium leading-normal">
                      Stable Diffusion 2
                    </div>
                    <Switch
                      isSelected={imgStatus[2]}
                      onValueChange={(value) => {
                        let a = [...imgStatus];
                        a[2] = value;
                        setImgStatus(a);
                      }}
                      classNames={{
                        base: cn(
                          "inline-flex flex-row-reverse w-full max-msm:max-w-max max-msm:mt-3 max-w-md items-start",
                          "justify-between cursor-pointer rounded-lg",
                          "data-[selected=true]:border-primary"
                        ),
                        wrapper: "p-0 h-4 overflow-visible",
                        thumb: cn(
                          "w-6 h-6 border-2 shadow-lg",
                          "group-data-[hover=true]:border-primary",
                          "group-data-[selected=true]:ml-6",
                          "group-data-[selected]:group-data-[pressed]:ml-4"
                        ),
                      }}
                    ></Switch>
                  </div>
                  <div className="max-msm:hidden text-[#FFF] text-2xl font-inter font-medium leading-normal">
                    Stable Diffusion 2
                  </div>
                  <div className="flex flex-col max-msm:hidden">
                    <div className="text-[#FFF] text-base font-inter font-normal leading-normal">
                      Enhanced from Stable Diffusion 2, this model excels in
                      complex image synthesis, with improved text encoding and
                      training.
                    </div>
                    <div className="flex flex-row justify-end mt-7 text-[#0A84FF] text-sm font-bold leading-normal">
                      Lean more
                    </div>
                  </div>
                  <div className="flex flex-col w-full msm:hidden">
                    <div className="flex flex-col gap-2 text-base text-[#FFF] font-normal leading-normal">
                      <p>+ Inexpensive, Fast</p>
                      <p>- Accuracy, Slightly Outdated</p>
                      <p className="mt-3 text-sm font-helvetica text-[#0A84FF] font-bold flex flex-row justify-center">
                        Lean more
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-4 rounded-2xl bg-[#23272B] p-6">
                  <div className="flex flex-row">
                    <Image
                      alt="leonardo-diffusion icon"
                      width={48}
                      height={48}
                      src={"/models/leonardo-diffusion-xl.png"}
                    />
                    <div className="ml-3 mr-[25px] mt-2 text-[#FFF] text-2xl msm:hidden max-msm:text-xl font-inter font-medium leading-normal">
                      Leonardo
                    </div>
                    <Switch
                      isSelected={imgStatus[3]}
                      onValueChange={(value) => {
                        let a = [...imgStatus];
                        a[3] = value;
                        setImgStatus(a);
                      }}
                      classNames={{
                        base: cn(
                          "inline-flex flex-row-reverse w-full max-msm:max-w-max max-msm:mt-3 max-w-md items-start",
                          "justify-between cursor-pointer rounded-lg",
                          "data-[selected=true]:border-primary"
                        ),
                        wrapper: "p-0 h-4 overflow-visible",
                        thumb: cn(
                          "w-6 h-6 border-2 shadow-lg",
                          "group-data-[hover=true]:border-primary",
                          "group-data-[selected=true]:ml-6",
                          "group-data-[selected]:group-data-[pressed]:ml-4"
                        ),
                      }}
                    ></Switch>
                  </div>
                  <div className="max-msm:hidden text-[#FFF] text-2xl font-inter font-medium leading-normal">
                    Leonardo
                  </div>
                  <div className="flex flex-col max-msm:hidden">
                    <div className="text-[#FFF] text-base font-inter font-normal leading-normal">
                      Create production-quality visual assets for your projects
                      with unprecedented quality, speed, and style-consistency.
                    </div>
                    <div className="flex flex-row justify-end mt-7 text-[#0A84FF] text-sm font-bold leading-normal">
                      Lean more
                    </div>
                  </div>
                  <div className="flex flex-col w-full msm:hidden">
                    <div className="flex flex-col gap-2 text-base text-[#FFF] font-normal leading-normal">
                      <p>+ Inexpensive, Fast</p>
                      <p>- Accuracy, Slightly Outdated</p>
                      <p className="mt-3 text-sm font-helvetica text-[#0A84FF] font-bold flex flex-row justify-center">
                        Lean more
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Tab>
            <Tab key="code" title="Code">
              <div className="w-full px-5 mt-[80px]">
                <div className="flex flex-col gap-[55px] justify-center">
                  <p className="text-[#D0D0D0] font-helvetica font-normal leading-7 tracking-[0.18px] text-[18px] text-center">
                    We thank you for your interest. These models are currently
                    in beta testing. To gain early access, please <br />{" "}
                    <a href="#" className="text-[#0A84FF]">
                      join our waitlist
                    </a>
                    . Meanwhile, feel free to use our text or image model
                    generation services
                  </p>
                  <div className="flex flex-row gap-6 text-base font-nasalization justify-center">
                    <Button
                      color="primary"
                      size="sm"
                      radius="full"
                      className="px-10 py-2 bg-[#0a84ff]"
                      onClick={() => setSelected("text")}
                    >
                      Text
                    </Button>
                    <Button
                      color="primary"
                      size="sm"
                      radius="full"
                      className="px-10 bg-[#0a84ff]"
                      onClick={() => setSelected("image")}
                    >
                      Image
                    </Button>
                  </div>
                </div>
              </div>
            </Tab>
            <Tab key="video" title="Video">
              <div className="w-full px-5 mt-[80px]">
                <div className="flex flex-col gap-[55px]">
                  <p className="text-[#D0D0D0] font-helvetica font-normal leading-7 tracking-[0.18px] text-[18px] text-center">
                    We thank you for your interest. These models are currently
                    in beta testing. To gain early access, please <br />{" "}
                    <a href="#" className="text-[#0A84FF]">
                      join our waitlist
                    </a>
                    . Meanwhile, feel free to use our text or image model
                    generation services
                  </p>
                  <div className="flex flex-row gap-6 text-base font-nasalization justify-center">
                    <Button
                      color="primary"
                      size="sm"
                      radius="full"
                      className="px-10 py-2 bg-[#0a84ff]"
                      onClick={() => setSelected("text")}
                    >
                      Text
                    </Button>
                    <Button
                      color="primary"
                      size="sm"
                      radius="full"
                      className="px-10 bg-[#0a84ff]"
                      onClick={() => setSelected("image")}
                    >
                      Image
                    </Button>
                  </div>
                </div>
              </div>
            </Tab>
            <Tab key="audio" title="Audio">
              <div className="w-full px-5 mt-[80px]">
                <div className="flex flex-col gap-[55px]">
                  <p className="text-[#D0D0D0] font-helvetica font-normal leading-7 tracking-[0.18px] text-[18px] text-center">
                    We thank you for your interest. These models are currently
                    in beta testing. To gain early access, please <br />{" "}
                    <a href="#" className="text-[#0A84FF]">
                      join our waitlist
                    </a>
                    . Meanwhile, feel free to use our text or image model
                    generation services
                  </p>
                  <div className="flex flex-row gap-6 text-base font-nasalization justify-center">
                    <Button
                      color="primary"
                      size="sm"
                      radius="full"
                      className="px-10 py-2 bg-[#0a84ff]"
                      onClick={() => setSelected("text")}
                    >
                      Text
                    </Button>
                    <Button
                      color="primary"
                      size="sm"
                      radius="full"
                      className="px-10 bg-[#0a84ff]"
                      onClick={() => setSelected("image")}
                    >
                      Image
                    </Button>
                  </div>
                </div>
              </div>
            </Tab>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Model_Interface;