import { Flex } from "@chakra-ui/react";
import { NextPage } from "next";
import Head from "next/head";
import React from "react";
import VideoPlayer from "../../components/VideoPlayer";
import { VideoCallProvider } from "../../contexts/videoCall";

const VideoCall: NextPage = () => {
  return (
    <>
      <Head>
				<title>In A Video Call</title>
			</Head>
      <Flex>
        <VideoCallProvider>
          <VideoPlayer />
        </VideoCallProvider>
      </Flex>
    </>
  )
}

export default React.memo(VideoCall);