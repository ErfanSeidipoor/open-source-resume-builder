"use client";

import { MUTATION_UPDATE_RESUME_RESUME } from "../../../gql";
import { SubmitHandler, useForm } from "react-hook-form";
import { useMutation } from "@apollo/client";
import { UpdateResumeResumeInputs } from "@dto";
import { classValidatorResolver } from "@hookform/resolvers/class-validator";
import { useToast } from "@resume-template-components/shadcn-ui";
import {
  UpdateResumeMutation,
  UpdateResumeMutationVariables,
} from "@chatbot/gql/graphql";
import { useStudioContext } from "../../../use-context";
import { useCallback, useEffect } from "react";

export const useData = () => {
  const {
    selectedResume,
    selectedResumeId,
    refetchSelectedResume,
    resumeSubSectionIndex,
    setResumeSubSectionIndex,
  } = useStudioContext();

  const { toast } = useToast();

  const getFormValues = useCallback(
    (selectedResumeId_: string, selectedResume_: typeof selectedResume) => ({
      resumeId: selectedResumeId_!,
      title: selectedResume_?.title || "",
      isShowProject: !!selectedResume_?.isShowProject,
      projectLabel: selectedResume_?.projectLabel || "",
      projects:
        selectedResume_?.projects?.map((project) => ({
          role: project.role || "",
          company: project.company || "",
          isShowLocation: !!project.isShowLocation,
          location: project.location || "",
          isShowDate: !!project.isShowDate,
          from: project.from || "",
          to: project.to || "",
          isShowPoints: !!project.isShowPoints,
          isShow: !!project.isShow,
          points: project.points?.map((point) => point || "") || [],
        })) || [],
    }),
    []
  );

  const form = useForm<UpdateResumeResumeInputs>({
    resolver: classValidatorResolver(UpdateResumeResumeInputs),
    mode: "onChange",
    defaultValues: getFormValues(selectedResumeId!, selectedResume),
  });

  useEffect(() => {
    form.reset(getFormValues(selectedResumeId!, selectedResume));
  }, [form, selectedResume, selectedResumeId, getFormValues]);

  const [updateResumeResume, { loading }] = useMutation<
    UpdateResumeMutation,
    UpdateResumeMutationVariables
  >(MUTATION_UPDATE_RESUME_RESUME, {
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: error.message,
      });
    },
    onCompleted: async () => {
      refetchSelectedResume();
      toast({
        title: "Welcome!",
        description: "Resume updated Successfully!",
      });
    },
  });

  const onSubmit: SubmitHandler<UpdateResumeResumeInputs> = (
    updateResumeResumeInputs
  ) => {
    updateResumeResume({ variables: { updateResumeResumeInputs } });
  };

  const addNewProject = () => {
    form.setValue("projects", [
      ...(form.getValues("projects") || []),
      {
        role: "Role",
        company: "company",
        isShowLocation: false,
        location: "location",
        isShowDate: false,
        from: "",
        to: "",
        isShowPoints: false,
        isShow: true,
        points: [],
      },
    ]);

    changeSelectedProjectIndex((form.getValues("projects")?.length || 0) - 1);
  };

  const removeProject = (projectIndex: number) => {
    form.setValue("projects", [
      ...(form.getValues("projects") || []).filter(
        (_, index) => index !== projectIndex
      ),
    ]);
    changeSelectedProjectIndex(
      resumeSubSectionIndex ? resumeSubSectionIndex - 1 : 0
    );
  };

  const addNewPoint = (projectIndex: number) => {
    form.setValue(
      "projects",
      [...(form.getValues("projects") || [])].map((project, index) => ({
        ...project,
        points:
          index === projectIndex
            ? [...(project.points || []), "new Point"]
            : project.points,
      }))
    );
    form.trigger();
  };

  const removePoint = (projectIndex: number, pointIndex: number) => {
    form.setValue(
      "projects",
      [...(form.getValues("projects") || [])].map((project, index) => ({
        ...project,
        points:
          index === projectIndex
            ? [
                ...(project.points || []).filter(
                  (_, index) => index !== pointIndex
                ),
              ]
            : project.points,
      }))
    );
    form.trigger();
  };

  const changeSelectedProjectIndex = (index: number) => {
    if (index < (form.getValues("projects")?.length || 0) && index >= 0) {
      setResumeSubSectionIndex(index);
      form.trigger();
    }
  };

  return {
    form,
    onSubmit,
    loading,
    resumeSubSectionIndex,
    addNewProject,
    removeProject,
    changeSelectedProjectIndex,
    addNewPoint,
    removePoint,
  };
};
