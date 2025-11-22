from django.test import SimpleTestCase
from ..parsers.reskilll import parse_reskilll
from ..parsers.devfolio import parse_devfolio


class ParsersTest(SimpleTestCase):
    def test_parse_reskilll_empty(self):
        html = "<html><body></body></html>"
        result = parse_reskilll(html, "https://reskilll.com/allhacks")
        self.assertIsInstance(result, list)

    def test_parse_devfolio_empty(self):
        html = "<html><body></body></html>"
        result = parse_devfolio(html, "https://devfolio.co/explore")
        self.assertIsInstance(result, list)
