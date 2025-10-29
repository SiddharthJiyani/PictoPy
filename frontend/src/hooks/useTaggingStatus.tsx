import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { usePictoQuery } from '@/hooks/useQueryExtension';
import { getFoldersTaggingStatus } from '@/api/api-functions';
import { setTaggingStatus } from '@/features/folderSlice';
import { selectTaggingStatus, selectActiveTaggingFolders } from '@/features/folderSelectors';
import { FolderTaggingInfo } from '@/types/FolderStatus';

/**
 * Custom hook for managing AI tagging status with polling
 * Polls the tagging status endpoint every 1 second when there are active tagging processes
 */
export const useTaggingStatus = () => {
  const dispatch = useDispatch();
  const taggingStatus = useSelector(selectTaggingStatus);
  const activeTaggingFolders = useSelector(selectActiveTaggingFolders);
  
  // Check if any folder has active tagging (percentage < 100 and has images)
  const hasActiveTagging = activeTaggingFolders.length > 0;

  // Query for tagging status with conditional polling
  const taggingStatusQuery = usePictoQuery({
    queryKey: ['taggingStatus'],
    queryFn: getFoldersTaggingStatus,
    refetchInterval: hasActiveTagging ? 1000 : 5000, // Poll every 1s when active, 5s otherwise
    refetchIntervalInBackground: true,
    enabled: true,
  });

  // Update Redux store when tagging status data changes
  useEffect(() => {
    if (taggingStatusQuery.data?.success && taggingStatusQuery.data?.data) {
      const statusData = taggingStatusQuery.data.data as FolderTaggingInfo[];
      if (statusData) {
        dispatch(setTaggingStatus(statusData));
      }
    }
  }, [taggingStatusQuery.data, dispatch]);

  return {
    taggingStatus,
    activeTaggingFolders,
    hasActiveTagging,
    isLoading: taggingStatusQuery.isLoading,
    isError: taggingStatusQuery.isError,
    error: taggingStatusQuery.error,
  };
};
