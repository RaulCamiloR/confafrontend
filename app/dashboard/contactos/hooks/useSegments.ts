"use client";

import { useState, useEffect } from "react";
import { segmentConstants } from "../constants/segments";
import { ChannelType } from "../constants/segments";
import axios from "axios";

interface Segment {
  segmentId: string;
  segmentName: string;
  status: string;
  channelType: string;
  recordsProcessed: number;
  startedAt: string;
  createdAt: string;
  updatedAt: string;
}

export const useSegments = ({
  hasEmailPermission,
  hasSmsPermission,
  hasVoicePermission,
}: {
  hasEmailPermission: boolean;
  hasSmsPermission: boolean;
  hasVoicePermission: boolean;
}) => {
  const [segments, setSegments] = useState<Segment[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [channelType, setChannelType] = useState<ChannelType>(
    hasEmailPermission
      ? "EMAIL"
      : hasSmsPermission
        ? "SMS"
        : hasVoicePermission
          ? "VOICE"
          : "EMAIL",
  );
  const pageSize = segmentConstants.pagesSize;

  const fetchSegments = async (pageNum: number, channel: ChannelType) => {
    setLoading(true);
    try {
      const { data } = await axios("/api/segmentos", {
        params: {
          channelType: channel,
          page: pageNum,
          pageSize,
          forDropdown: false,
        },
      });

      if (data) {
        const segmentsArray = Array.isArray(data) ? data : data.segments || [];
        setSegments(segmentsArray);
        setHasNextPage(segmentsArray.length >= pageSize);
      }
    } catch (error) {
      console.error("Error al cargar segmentos:", error);
      setSegments([]);
      setHasNextPage(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSegments(page, channelType);
  }, [page, channelType]);

  const handleNextPage = () => {
    if (segments.length > 0 && hasNextPage) {
      setPage((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage((prev) => prev - 1);
      setHasNextPage(true);
    }
  };

  const handleChannelChange = (channel: ChannelType) => {
    if (channel !== channelType) {
      console.log("channel", channel);
      setChannelType(channel);
      setPage(1);
    }
  };

  return {
    segments,
    loading,
    page,
    hasNextPage,
    channelType,
    handleNextPage,
    handlePrevPage,
    handleChannelChange,
  };
};
