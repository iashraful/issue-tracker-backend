"""
    It's a bad requirement. Running unittest from API POST. I'm doing this because of the stupid requirement from my
    respected internship supervisor. I'll remove this feature after the internship presentation.

    Please don't think negative about my comment. It can be a good requirement but May be I'm making it bad way.
    Whatever I can't argue with my supervisor so that I'm doing that way. Personally I'm not liking it much.
"""

import os

from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

__author__ = 'Ashraful'



TEST_MAPPINGS = {
    'login': 'test_login',
    'logout': 'test_logout',
    'profile_details': 'test_profile_details'
}


class UnitTestAPIView(APIView):
    def test_mapping(self, test_name=None):
        extra_params = ""
        if test_name is None:
            return extra_params
        try:
            extra_params = "core.tests.TestCoreApi.{0}".format(TEST_MAPPINGS.get(test_name))
        except Exception as exp:
            print(exp)
            # extra_params = "pms.tests.TestPMSApi.{0}".format(TEST_MAPPINGS.get(test_name))
        return extra_params

    def post(self, request, *args, **kwargs):
        data = request.data
        run_test = data.get('tests')
        test_name = data.get('function')
        response_data = {
            "success": False,
            "message": "Cannot run tests at this moment."
        }
        if run_test:
            extra_params = self.test_mapping(test_name)
            output = os.popen("python manage.py test").read()
            output = output.replace('\n', '<br/>')
            total_tests = 0
            success_tests = 0
            failed_tests = 0
            for text in output.split('<br/>'):
                if text.startswith('(*)'):
                    total_tests += 1
                if text.startswith('[S]'):
                    success_tests += 1
                if text.startswith('[F]'):
                    failed_tests += 1
            response_data = {
                "result": str(output),
                "count_tests": total_tests,
                "success_tests": success_tests,
                "failed_tests": failed_tests,
            }
            return Response(data=response_data, status=status.HTTP_200_OK)
        return Response(data=response_data, status=status.HTTP_400_BAD_REQUEST)
