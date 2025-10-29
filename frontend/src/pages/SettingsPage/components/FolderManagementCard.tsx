import React from 'react';
import { Folder, Trash2, AlertCircle, Check, Loader2 } from 'lucide-react';

import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useSelector } from 'react-redux';
import FolderPicker from '@/components/FolderPicker/FolderPicker';

import { useFolderOperations } from '@/hooks/useFolderOperations';
import { useTaggingStatus } from '@/hooks/useTaggingStatus';
import { selectTaggingStatus } from '@/features/folderSelectors';
import { FolderDetails } from '@/types/Folder';
import SettingsCard from './SettingsCard';

/**
 * Component for managing folder operations in settings
 */
const FolderManagementCard: React.FC = () => {
  const {
    folders,
    toggleAITagging,
    deleteFolder,
    enableAITaggingPending,
    disableAITaggingPending,
    deleteFolderPending,
  } = useFolderOperations();

  // Initialize tagging status polling
  useTaggingStatus();

  const taggingStatus = useSelector(selectTaggingStatus);

  return (
    <SettingsCard
      icon={Folder}
      title="Folder Management"
      description="Configure your photo library folders and AI settings"
    >
      {folders.length > 0 ? (
        <div className="space-y-3">
          {folders.map((folder: FolderDetails, index: number) => (
            <div
              key={index}
              className="group border-border bg-background/50 relative rounded-lg border p-4 transition-all hover:border-gray-300 hover:shadow-sm dark:hover:border-gray-600"
            >
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-3">
                    <Folder className="h-4 w-4 flex-shrink-0 text-gray-500 dark:text-gray-400" />
                    <span className="text-foreground truncate">
                      {folder.folder_path}
                    </span>
                  </div>

                  {/* AI Tagging Progress, Loading, or Empty Folder Message */}
                  {folder.AI_Tagging && (
                    <div className="mt-3 transition-all duration-300 ease-in-out">
                      {!taggingStatus[folder.folder_id] ? (
                        // Loading state - show while waiting for initial API response
                        <div className="flex items-center gap-2 rounded-md bg-blue-50 px-3 py-2 text-sm text-blue-700 dark:bg-blue-900/20 dark:text-blue-300">
                          <Loader2 className="h-4 w-4 flex-shrink-0 animate-spin" />
                          <span>Checking folder status...</span>
                        </div>
                      ) : taggingStatus[folder.folder_id].has_images === false ? (
                        // Empty folder message
                        <div className="flex items-center gap-2 rounded-md bg-yellow-50 px-3 py-2.5 text-sm text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200 border border-yellow-200 dark:border-yellow-800/30">
                          <AlertCircle className="h-4 w-4 flex-shrink-0" />
                          <span className="font-medium">No images found in this folder</span>
                        </div>
                      ) : taggingStatus[folder.folder_id].has_images === true && (
                        // Progress bar or completion status
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground">AI Tagging Progress</span>
                            {taggingStatus[folder.folder_id].tagging_percentage >= 100 ? (
                              // Completed - show checkmark and 100%
                              <span className="flex items-center gap-1 text-green-600 dark:text-green-400 font-medium">
                                <Check className="h-3.5 w-3.5" />
                                100%
                              </span>
                            ) : (
                              // In progress - show only percentage
                              <span className="text-muted-foreground">
                                {Math.round(taggingStatus[folder.folder_id].tagging_percentage)}%
                              </span>
                            )}
                          </div>
                          <Progress 
                            value={taggingStatus[folder.folder_id].tagging_percentage}
                            className="h-2"
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="ml-4 flex items-center gap-4">
                  <div className="flex items-center gap-3">
                    <span className="text-muted-foreground text-sm">
                      AI Tagging
                    </span>
                    <Switch
                      checked={folder.AI_Tagging}
                      onCheckedChange={() => toggleAITagging(folder)}
                      disabled={
                        enableAITaggingPending || disableAITaggingPending
                      }
                    />
                  </div>

                  <Button
                    onClick={() => deleteFolder(folder.folder_id)}
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 text-gray-500 hover:border-red-300 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
                    disabled={deleteFolderPending}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-8 text-center">
          <Folder className="mx-auto mb-3 h-12 w-12 text-gray-400" />
          <h3 className="text-foreground mb-1 text-lg font-medium">
            No folders configured
          </h3>
          <p className="text-muted-foreground text-sm">
            Add your first photo library folder to get started
          </p>
        </div>
      )}

      <div className="border-border mt-6 border-t pt-6">
        <FolderPicker />
      </div>
    </SettingsCard>
  );
};

export default FolderManagementCard;