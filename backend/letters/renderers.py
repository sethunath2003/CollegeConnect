from rest_framework import renderers
from rest_framework.renderers import JSONRenderer


class PDFRenderer(renderers.BaseRenderer):
    """DRF renderer which returns raw PDF bytes.

    The view should return bytes or a file-like object (BytesIO). For errors
    the view may return a dict and DRF will use a JSON renderer instead.
    """
    media_type = "application/pdf"
    format = "pdf"
    charset = None
    render_style = "binary"

    def render(self, data, media_type=None, renderer_context=None):
        # If DRF is returning an error (status >= 400) prefer JSON output.
        # renderer_context contains the Response instance under 'response'.
        try:
            response = (renderer_context or {}).get('response')
            if response is not None and getattr(response, 'status_code', 0) >= 400:
                # Delegate error rendering to JSONRenderer so errors are
                # returned as application/json instead of being coerced to PDF bytes.
                return JSONRenderer().render(data, media_type='application/json', renderer_context=renderer_context)
        except Exception:
            # If anything goes wrong while checking response, continue to normal rendering
            pass
        # If bytes provided, return as-is
        if isinstance(data, (bytes, bytearray)):
            return bytes(data)

        # If file-like, read and return bytes
        if hasattr(data, "read"):
            try:
                data.seek(0)
            except Exception:
                pass
            return data.read()

        # Otherwise return data unchanged (DRF will handle errors with JSONRenderer)
        return data
