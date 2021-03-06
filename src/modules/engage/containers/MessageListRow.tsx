import gql from 'graphql-tag';
import { IRouterProps } from 'modules/common/types';
import { Alert, confirm, withProps } from 'modules/common/utils';
import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import { withRouter } from 'react-router';
import { MessageListRow } from '../components';
import { mutations, queries } from '../graphql';
import {
  IEngageMessage,
  MutationVariables,
  RemoveMutationResponse,
  SetLiveManualMutationResponse,
  SetLiveMutationResponse,
  SetPauseMutationResponse
} from '../types';
import { crudMutationsOptions } from '../utils';

type Props = {
  isChecked: boolean;
  toggleBulk: (value: IEngageMessage, isChecked: boolean) => void;
  message: IEngageMessage;
  queryParams: any;
};

type FinalProps = Props &
  RemoveMutationResponse &
  SetPauseMutationResponse &
  SetLiveMutationResponse &
  SetLiveManualMutationResponse &
  IRouterProps;

const MessageRowContainer = (props: FinalProps) => {
  const {
    history,
    message,
    removeMutation,
    setPauseMutation,
    setLiveMutation,
    setLiveManualMutation,
    isChecked,
    toggleBulk
  } = props;

  const doMutation = mutation =>
    mutation({
      variables: { _id: message._id }
    })
      .then(() => {
        Alert.success('Congrats');
      })
      .catch(error => {
        Alert.error(error.message);
      });

  const edit = () => {
    history.push(`/engage/messages/edit/${message._id}`);
  };

  const show = () => {
    history.push(`/engage/messages/show/${message._id}`);
  };

  const remove = () => {
    confirm().then(() => {
      doMutation(removeMutation).then(() => {
        history.push('/engage');
      });
    });
  };

  const setLiveManual = () => doMutation(setLiveManualMutation);
  const setLive = () => doMutation(setLiveMutation);
  const setPause = () => doMutation(setPauseMutation);

  const updatedProps = {
    ...props,
    edit,
    show,
    remove,
    setLive,
    setLiveManual,
    setPause,
    isChecked,
    toggleBulk
  };

  return <MessageListRow {...updatedProps} />;
};

const statusMutationsOptions = ({ queryParams, message }) => {
  return {
    refetchQueries: [
      {
        query: gql(queries.statusCounts),
        variables: {
          kind: queryParams.kind || ''
        }
      },
      {
        query: gql(queries.engageMessageDetail),
        variables: {
          _id: message._id
        }
      }
    ]
  };
};

export default withProps<Props>(
  compose(
    graphql<Props, RemoveMutationResponse, MutationVariables>(
      gql(mutations.messageRemove),
      {
        name: 'removeMutation',
        options: crudMutationsOptions
      }
    ),
    graphql<Props, SetPauseMutationResponse, MutationVariables>(
      gql(mutations.setPause),
      {
        name: 'setPauseMutation',
        options: statusMutationsOptions
      }
    ),
    graphql<Props, SetLiveMutationResponse, MutationVariables>(
      gql(mutations.setLive),
      {
        name: 'setLiveMutation',
        options: statusMutationsOptions
      }
    ),
    graphql<Props, SetLiveManualMutationResponse, MutationVariables>(
      gql(mutations.setLiveManual),
      {
        name: 'setLiveManualMutation',
        options: statusMutationsOptions
      }
    )
  )(withRouter<FinalProps>(MessageRowContainer))
);
