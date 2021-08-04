import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

const router = new Router({
  // mode: 'history',
  routes: [
    {
      path: "/",
      name: "首页",
      component: () => import("../page/index")
    },
    {
      path: "/backlog",
      name: "待办事项",
      props: () => ({
        isApproval: true
      }),
      component: () => import("../page/backlog.vue")
    },
    {
      path: "/reimburse-apply",
      name: "报销申请",
      meta: {
        keepAlive: true
      },
      component: () => import("../page/finance/reimburse/reimburse-apply.vue")
    },
    {
      path: "/reimburse-approval",
      name: "报销审批",
      props: route => ({
        isApproval: true
      }),
      component: () =>
        import("../page/finance/reimburse/reimburse-approval.vue")
    },
    {
      path: "/fund-apply",
      name: "款项申请",
      component: () => import("../page/finance/fund/fund-apply.vue")
    },
    {
      path: "/fund-approval",
      name: "款项审批",
      props: route => ({
        isApproval: true
      }),
      component: () => import("../page/finance/fund/fund-approval.vue")
    },
    {
      path: "/project-apply",
      name: "项目申请",
      props: route => ({
        isApproval: true
      }),
      component: () => import("../page/finance/project/project-apply.vue")
    },
    {
      path: "/project-approval",
      name: "项目审批",
      props: route => ({
        isApproval: true
      }),
      component: () => import("../page/finance/project/project-approval.vue")
    },
    {
      path: "/project-details",
      name: "项目详情",
      props: route => ({
        type: route.query.type || "details",
        name: route.query.reimburseName || "项目",
        isApproval: route.query.isApproval || false
      }),
      component: () => import("../page/finance/project/project-details.vue")
    },
    {
      path: "/fixed-apply",
      name: "固定资产申请",
      component: () => import("../page/finance/fixedAssets/fixed-apply.vue")
    },
    {
      path: "/fixed-details",
      name: "固定资产详请",
      props: route => ({
        type: route.query.type,
        isApproval: route.query.isApproval || false
      }),
      component: () => import("../page/finance/fixedAssets/fixed-details.vue")
    },
    {
      path: "/fixed-approval",
      name: "固定资产审批",
      props: route => ({
        isApproval: route.query.isApproval || true
      }),
      component: () => import("../page/finance/fixedAssets/fixed-approval.vue")
    },
    {
      path: "/useChapter-apply",
      name: "盖章申请",
      component: () => import("../page/erp/useChapter/useChapter-apply.vue")
    },
    {
      path: "/useChapter-details",
      name: "盖章申请详情",
      props: route => ({
        type: route.query.type,
        isApproval: route.query.isApproval || false
      }),
      component: () => import("../page/erp/useChapter/useChapter-details.vue")
    },
    {
      path: "/useChapter-approval",
      name: "盖章审批",
      props: route => ({
        isApproval: route.query.isApproval || true
      }),
      component: () => import("../page/erp/useChapter/useChapter-approval.vue")
    },
    {
      path: "/stampChapter-apply",
      name: "借章申请",
      component: () => import("../page/erp/stampChapter/stampChapter-apply.vue")
    },
    {
      path: "/stampChapter-approval",
      name: "借章审批",
      props: route => ({
        isApproval: route.query.isApproval || true
      }),
      component: () =>
        import("../page/erp/stampChapter/stampChapter-approval.vue")
    },
    {
      path: "/stampChapter-details",
      name: "借章详情",
      props: route => ({
        type: route.query.type,
        isApproval: route.query.isApproval || false
      }),
      component: () =>
        import("../page/erp/stampChapter/stampChapter-details.vue")
    },
    {
      path: "/qualificationLoan-apply",
      name: "公司资质出借申请",
      component: () =>
        import("../page/erp/qualificationLoan/qualificationLoan-apply.vue")
    },
    {
      path: "/qualificationLoan-approval",
      name: "公司资质出借审批",
      props: route => ({
        isApproval: route.query.isApproval || true
      }),
      component: () =>
        import("../page/erp/qualificationLoan/qualificationLoan-approval.vue")
    },
    {
      path: "/qualificationLoan-details",
      name: "公司资质出借详情",
      props: route => ({
        type: route.query.type,
        isApproval: route.query.isApproval || false
      }),
      component: () =>
        import("../page/erp/qualificationLoan/qualificationLoan-details.vue")
    },
    {
      path: "/payment-approval",
      name: "借款审批",
      component: () => import("../page/erp/payment/payment-approval.vue")
    },
    {
      path: "/reimburse-details",
      name: "报销单详情",
      meta: {
        keepAlive: false
      },
      props: route => ({
        type: route.query.type,
        name: route.query.reimburseName,
        isApproval: route.query.isApproval || false
      }),
      component: () => import("../page/finance/reimburse/reimburse-details.vue")
    },
    {
      path: "/fund-details",
      name: "款项详情",
      props: route => ({
        type: route.query.type,
        name: route.query.fundName,
        isApproval: route.query.isApproval || false
      }),
      component: () => import("../page/finance/fund/fund-details.vue")
    },
    {
      path: "/dispatch",
      name: "派工列表",
      props: route => ({
        type: route.query.type,
        name: route.query.fundName,
        isApproval: route.query.isApproval || false
      }),
      component: () => import("../page/dispatch/list.vue")
    },
    {
      path: "/dispatch-edit",
      name: "编辑派工",
      props: route => ({
        type: route.query.type,
        name: route.query.fundName,
        isApproval: route.query.isApproval || false
      }),
      component: () => import("../page/dispatch/dispatchEdit.vue")
    },
    {
      path: "/train",
      name: "培训列表",
      props: route => ({
        type: route.query.type,
        name: route.query.fundName,
        isApproval: route.query.isApproval || false
      }),
      component: () => import("../page/train/train-list.vue")
    },
    {
      path: "/train-video",
      name: "培训详情",
      props: route => ({
        id: route.query.id,
        url: route.query.url
      }),
      component: () => import("../page/train/train-video")
    },
    {
      path: "/select-approver-list",
      name: "选择审批人列表",
      props: route => ({
        type: route.query.type
      }),
      component: () => import("../page/selectApprover/select-approver-list.vue")
    },
    {
      path: "/select-approver/:index",
      //name: '选择审批人',
      component: () => import("../page/selectApprover/select-approver.vue"),
      children: [
        {
          path: "/",
          name: "集团架构",
          component: () =>
            import(
              "../page/selectApprover/select-approve-children/group-structure.vue"
            )
        },
        {
          path: "department",
          name: "部门列表",
          component: () =>
            import(
              "../page/selectApprover/select-approve-children/department.vue"
            )
        },
        {
          path: "co-worker",
          name: "同事列表",
          component: () =>
            import(
              "../page/selectApprover/select-approve-children/co-worker.vue"
            )
        }
      ]
    },
    {
      path: "/work-cost",
      name: "办公费用",
      props: route => ({
        detailsData: route.query.data,
        type: route.query.type,
        index: route.query.index
      }),
      component: () => import("../page/finance/reimburse/work-cost.vue")
    },
    {
      path: "/activity-cost",
      name: "活动费用",
      props: route => ({
        detailsData: route.query.data,
        type: route.query.type,
        index: route.query.index
      }),
      component: () => import("../page/finance/reimburse/activity-cost.vue")
    },
    {
      path: "/stay-cost",
      name: "住宿费用",
      props: route => ({
        detailsData: route.query.data,
        type: route.query.type,
        index: route.query.index
      }),
      component: () => import("../page/finance/reimburse/stay-cost.vue")
    },
    {
      path: "/traffic-cost",
      name: "交通费用",
      props: route => ({
        detailsData: route.query.data,
        type: route.query.type,
        index: route.query.index
      }),
      component: () => import("../page/finance/reimburse/traffic-cost.vue")
    },
    {
      path: "/rest-cost",
      name: "其他费用",
      props: route => ({
        detailsData: route.query.data,
        type: route.query.type,
        index: route.query.index
      }),
      component: () => import("../page/finance/reimburse/rest-cost.vue")
    }
  ]
});

router.onError(error => {
  console.log("路由报错：：：", error);
  const pattern = /Loading chunk (\d)+ failed/g;
  const isChunkLoadFailed = error.message.match(pattern);
  const targetPath = router.history.pending.fullPath;
  if (isChunkLoadFailed) {
    router.replace(targetPath);
  }
});

export default router;
