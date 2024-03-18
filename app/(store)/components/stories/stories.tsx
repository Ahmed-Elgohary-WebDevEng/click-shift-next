"use client";

import { useQuery } from "@tanstack/react-query";
import storyService from "@/services/story";

import useSettingsStore from "@/global-store/settings";
import { Swiper, SwiperSlide } from "swiper/react";
import { StoryPortal } from "./stories-portal";
import StoriesProvider from "./stories.provider";
import { StoryBubble } from "./story-bubble";

const Stories = () => {
  const language = useSettingsStore((state) => state.selectedLanguage);
  const { data } = useQuery(["stories", language?.locale], () =>
    storyService.getAll({ lang: language?.locale })
  );
  if (data && data.length === 0) {
    return null;
  }
  return (
    <section className="xl:container px-2 md:px-4 mt-4 mb-4 md:mb-2">
      <StoriesProvider>
        <Swiper slidesPerView="auto" spaceBetween={20}>
          {data?.map((stories, idx) => (
            <SwiperSlide className="max-w-max" key={stories[0].shop_id}>
              <StoryBubble storyIndex={idx} stories={stories} />
            </SwiperSlide>
          ))}
        </Swiper>
        <StoryPortal stories={data} />
      </StoriesProvider>
    </section>
  );
};

export default Stories;
