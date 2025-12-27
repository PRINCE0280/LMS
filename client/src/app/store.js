import { authApi } from '@/features/api/authapi';
import {configureStore} from '@reduxjs/toolkit';
import rootReducer from './rootReducer';
import { courseApi } from '@/features/api/courseApi';
import { purchaseApi } from '@/features/api/purchaseApi';
import { courseProgressApi } from '@/features/api/courseProgressApi';
import { subscriptionApi } from '@/features/api/subscriptionApi';
import { assignmentApi } from '@/features/api/assignmentApi';
import { quizApi } from '@/features/api/quizApi';

export const appStore = configureStore({     
      reducer: rootReducer,
      middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(
            authApi.middleware,
            courseApi.middleware,
            purchaseApi.middleware,
            courseProgressApi.middleware,
            subscriptionApi.middleware,
            assignmentApi.middleware,
            quizApi.middleware
      )
});    

const initializeApp=async () => {
      await appStore.dispatch(authApi.endpoints.loadUser.initiate({},
            { forceRefetch: true }
      ));
};
initializeApp();